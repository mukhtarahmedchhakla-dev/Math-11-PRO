'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('Verifying link...')
  const [done, setDone] = useState(false)

  useEffect(() => {
    supabase.auth.exchangeCodeForSession(window.location.href).then(({error}) => {
      if (error) {
        setStatus('Link Expire ho gaya. Naya mail bhejo.')
      } else {
        setStatus('Naya Password Daalo')
      }
    })
  }, [])

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setStatus(error.message)
    } else {
      setStatus('Password Change Ho Gaya!')
      setDone(true)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Reset Password</h2>
      <p>{status}</p>
      {!done && (
        <>
          <input
            type="password"
            placeholder="Naya Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          />
          <button onClick={handleUpdate} style={{ width: '100%', padding: '12px', marginTop: '10px', background: 'black', color: 'white' }}>
            Update Password
          </button>
        </>
      )}
    </div>
  )
}
