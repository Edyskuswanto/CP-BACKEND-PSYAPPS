# Gunakan image node sebagai base image
FROM node:14

# Tentukan working directory di dalam container
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file ke dalam container
COPY . .

# Tentukan port yang digunakan oleh aplikasi
ENV PORT 8080

# Expose port yang sesuai
EXPOSE 8080

# Command untuk menjalankan aplikasi
CMD ["node", "server.js"]
