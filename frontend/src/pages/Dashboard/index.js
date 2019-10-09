import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import socketio from 'socket.io-client'
import api from '../../services/api'

import './styles.css'

export default function Dashboard() {

  const [spots, setSpots] = useState([])
  const [requests, setRequests] = useState([])

  const user_id = localStorage.getItem('user')
  const socket = useMemo( () => socketio('http://localhost:3333', {
    query: { user_id }
  }), [user_id])

  useEffect(() => {
    socket.on('booking_request', data => {
      setRequests([ ...requests, data])
    })
  }, [requests, socket])

  useEffect(()=> {
    async function loadSpots() {
      const user_id = localStorage.getItem('user')
      const response = await api.get('/dashboard', {
        headers: { user_id }
      })

      setSpots(response.data)
    }

    loadSpots()
  }, []) //quando vc quer que a primeira funcao execute? passe essa dependencia no segundo argumento. Quando as variaveis do segundo argumento forem alteradas, a funcao que esta no primeiro argumento será executada. Quando passa o array vazio ela sera executada uma unica vez

  async function handleAccept(id) {
    await api.post(`/bookings/${id}/approvals`)

    setRequests(requests.filter(request => request._id !== id))
  }

  async function handleReject(id) {
    await api.post(`/bookings/${id}/rejections`)

    setRequests(requests.filter(request => request._id !== id))
  }

  return (
    <>
      <ul className='notifications'>
        {requests.map(request => (
          <li key={request.id}>
            <p>
              <strong>{request.user.email}</strong> está solicitando uma reserva em <strong>{request.spot.company}</strong> para a data: <strong>{request.date}</strong>.
            </p>
            <button className='accept' onClick={() => handleAccept(request_id)}>ACEITAR</button>
            <button className='reject' onClick={() => handleReject(request_id)}>REJEITAR</button>
          </li>
        ))}
      </ul>

      <ul className='spot-list'>
        {spots.map(spot => (
          <li key={spot._id}>
            <header style={{ backgroundImage: `url(${spot.thumbnail_url})`}} />
            <strong>{spot.company}</strong>
            <span>{spot.price ? `R${spot.price}/dia` : 'GRATUITO'}</span>
          </li>
        ))}
      </ul>

      <Link to='/new'>
        <button className='btn'>Cadastrar novo spot</button>
      </Link>
    </>
  )
}