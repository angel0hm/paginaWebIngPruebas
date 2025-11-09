# Usamos Node.js LTS
FROM node:20

# Directorio de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY server/package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos todo el proyecto
COPY . .

# Exponemos el puerto que usará Express
EXPOSE 3000

# Comando para correr la app
CMD ["node", "server/server.js"]
