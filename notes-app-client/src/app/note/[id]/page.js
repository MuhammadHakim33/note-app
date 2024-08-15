'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'

import {
	Container,
	Heading,
	Card, CardHeader, CardBody,
	Text,
	Flex, Spacer,
	Button,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    FormControl, FormLabel, Input, Textarea,
	Alert, AlertDescription,
    useDisclosure,
} from '@chakra-ui/react'

import { DeleteIcon, EditIcon, ArrowBackIcon } from '@chakra-ui/icons'

export default function Note({ params }) {
	const router = useRouter()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [note, setNote] = useState()
    const [title, setTitle] = useState('')
	const [body, setBody] = useState('')
	const [success, setSuccess] = useState()
	const [error, setError] = useState()

    useEffect(() => {
		fetch(`http://localhost:8080/${params.id}`)
		.then((res) => res.json())
		.then((res) => {
            setNote(res.data)
            setTitle(res.data.title)
            setBody(res.data.body)
        })
	}, [success])

    function handleEdit () {
		setError()
		setSuccess()
		
		const req = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ 
				title: title,
				body: body,
			})
		};

		fetch(`http://localhost:8080/${params.id}`, req)
			.then(res => res.json())
			.then(res => res.success == false ? setError(res) : setSuccess(res))
			.finally(res => console.log(error))
    }

    function handleDelete () {
		const req = {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		};

		fetch(`http://localhost:8080/${params.id}`, req)
			.then(res => res.json())
			.then(res => console.log(res))

		router.push('/')
    }

	function handleCloseModal() {
		setError()
		setSuccess()
	}

    return (
        <>
            <Container className='mt-6'>
                <Link href="/">
                    <Button size='sm' variant='ghost'><ArrowBackIcon boxSize={5}/></Button>
                    </Link>
                <Card w="100%" borderRadius="0" variant='outline' className='mt-2'>
                    <CardHeader>
                        <Flex gap='2' className='mb-3'>
                            <Spacer />
					        <Button size='sm' colorScheme='blue' onClick={onOpen}><EditIcon /></Button>
					        <Button size='sm' colorScheme='red' onClick={handleDelete}><DeleteIcon /></Button>
                        </Flex >
                        <Heading as='h4' size='md' fontWeight='600' lineHeight='130%' className='mb-2'>{note?.title}</Heading>
                        <Text opacity='.6' fontSize='sm' fontWeight='400'>{note?.createdat}</Text>
                    </CardHeader>
                    <CardBody>
                        <Text opacity='.9' fontWeight='400'>{note?.body}</Text>
                    </CardBody>
                </Card>
			</Container>

            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Update Note</ModalHeader>
					<ModalCloseButton onClick={handleCloseModal}/>
					<ModalBody>
						{success?.success == true && 
							<Alert status='success' className='mb-4'>
								<AlertDescription>{success?.message}</AlertDescription>
							</Alert>	
						}
						<FormControl className='mb-4' isRequired>
							<FormLabel>Title</FormLabel>
							<Input type='text' value={title} onChange={(e) => setTitle(e.target.value)}/>
							{error?.error_code == 400 && <p className='text-red-600 mt-3'>{error?.errors.msg}</p>}
						</FormControl>
						<FormControl>
							<FormLabel>Content</FormLabel>
							<Textarea value={body == null ? '':body} onChange={(e) => setBody(e.target.value)}/>
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='blue' onClick={handleEdit}>Update</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
        </>
    );
}