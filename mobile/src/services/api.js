import axios from 'axios'

const api = axios.create({
  baseURL: '' //ver o ip da minha maquina e conectar pela rede, pode ser uma maneira
})

export default api