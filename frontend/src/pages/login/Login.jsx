import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
      <div className='h-full w-full p-6 bg-gray-800 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 border border-gray-100'>
        <h1 className='text-3xl font-semibold text-center text-gray-300'>Login
          <span className='text-yellow-500' > Missive</span>
        </h1>

        <form>

          {/* div 1O */}
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>Username</span>
            </label>
            <input type="text" placeholder='Enter Username' className='w-full input input-bordered h-10' />
          </div>
          {/* div 1C */}

          {/* div 2O */}
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>Password</span>
            </label>
            <input type="password" placeholder='Enter Password' className='w-full input input-bordered h-10' />
          </div>
          {/* div 2C */}

        <Link to={'/signup'} className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block'>
         {"Don't"} have an account?
        </Link>

        <div>
          <button className='btn btn-block btn-sm mt-2'>Login</button>
        </div>
        </form>

      </div>

    </div>
  )
}

export default Login
