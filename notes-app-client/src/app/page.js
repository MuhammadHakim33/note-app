'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'

import {
	Badge,
	Container,
	Heading,
	VStack,
	Card, CardBody,
	Text,
	Flex, Spacer,
	Button,
	Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
	FormControl, FormLabel, Input, Textarea,
	Alert, AlertDescription,
	useDisclosure,
} from '@chakra-ui/react'

import { SmallAddIcon } from '@chakra-ui/icons'

export default function Home() {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [notes, setNotes] = useState([])
	const [title, setTitle] = useState('')
	const [body, setBody] = useState('')
	const [success, setSuccess] = useState()
	const [error, setError] = useState()

	useEffect(() => {
		fetch('http://localhost:8080')
		.then((res) => res.json())
		.then((res) => setNotes(res.data))
	}, [notes])

	function handleSubmit() {
		setError()
		setSuccess()

		const req = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ 
				title: title,
				body: body,
			})
		};

		setTitle('')
		setBody('')

		fetch('http://localhost:8080', req)
			.then(res => res.json())
			.then(res => res.success == false ? setError(res) : setSuccess(res))
			.finally(res => console.log(error))
	}

	function handleCloseModal() {
		setError()
		setSuccess()
		setTitle()
		setBody()
	}

	return (
		<>
			<Container className='my-6'>
				<Flex>
					<Heading as='h3' size='lg' className='mb-4'>My Notes</Heading>
					<Spacer />
					<Button onClick={onOpen}><SmallAddIcon /></Button>
				</Flex>
				<VStack>
					{}
					{notes.length == 0 ? 
						<Badge colorScheme='red' className='mt-8'>Tidak Ada Catatan</Badge>
						: 
						notes.map((note) => (
							<Card key={note.id} w="100%" borderRadius="0" variant='outline'>
								<CardBody>
									<Link href={`/note/${note.id}`}>
										<Heading as='h4' size='md' fontWeight='600' lineHeight='130%' className='mb-2'>{note.title}</Heading>
									</Link>
									<Text opacity='.9' noOfLines={1} fontWeight='400' className='mb-3'>{note.body}</Text>
									<Text opacity='.6' fontSize='sm' fontWeight='400'>{note.createdat}</Text>
								</CardBody>
							</Card>
						))
					}
				</VStack>
			</Container>

			<Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Create Note</ModalHeader>
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
							<Textarea value={body} onChange={(e) => setBody(e.target.value)}/>
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme='blue' onClick={handleSubmit}>Create</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
