# notes-app
Dibimbing.id test study case lamaran magang

## notes-app-api installation
1. install semua dependencies 
    ```sh
    npm install
    ```
2. Rename file `.env.example` menjadi `.env`
3. Buat database postgresql
4. Setting koneksi database postgresql di file `.env`
5. Jalankan migrasi prisma orm
    ```sh
    npx prisma migrate dev --name init
    ```
6. Pastikan sudah terinstall prisma client
7. Jalankan program
    ```sh
    node index
    ```

## notes-app-client installation
1. install semua dependencies 
    ```sh
    npm install
    ```
2. Jalankan program
    ```sh
    npm run dev
    ```