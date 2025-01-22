import GenderCheck from './GenderCheck'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import useSignup from '../../hooks/useSignup'

const Signup = () => {

  const [inputs, setInputs] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: '',
  });

  const {loading,signup} = useSignup()
  // This will dynamically udate state; this destructuring helps get rid of  method (e)=>setInputs({...inputs,fullName:e.target.value})

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value
    }))
  };

  //  Deatructuring and getting all inputs on the fly
  const { fullName, username, password, confirmPassword, gender } = inputs;

//  HandelSubmit 

const handleSubmit =async (e)=>{
  e.preventDefault();
  await signup(inputs)
};

const checkboxHandler =(gender)=>{
  setInputs({
    ...inputs,
    gender
  })
}




  return (
    <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
      <div className='h-full w-full p-6 bg-gray-800 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 border border-gray-100'>
        <h1 className='text-3xl font-semibold text-center text-gray-300'>SignUp To
          <span className='text-yellow-500' > Missive</span>
        </h1>

        <form onSubmit={handleSubmit}>

          {/* div 1O */}
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>Full Name</span>
            </label>
            <input
              type="text"
              placeholder='Jhon Doe'
              className='w-full input input-bordered h-10'
              value={fullName}
              name='fullName'
              onChange={handleChange}
            />
          </div>
          {/* div 1C */}

          {/* div 2O */}
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>userName</span>
            </label>
            <input type="text" placeholder='jhondoe' className='w-full input input-bordered h-10' name='username' value={username}
              onChange={handleChange} />
          </div>
          {/* div 2C */}

          {/*  div3O */}
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>Password</span>
            </label>
            <input type="password" placeholder='Enter Password' className='w-full input input-bordered h-10' name='password' value={password}
              onChange={handleChange} />
          </div>
          {/*  div3C */}

          {/*  div4O */}
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>Confirm Password</span>
            </label>
            <input type="password" placeholder='Confirm Password' className='w-full input input-bordered h-10' name='confirmPassword' value={confirmPassword}
              onChange={handleChange} />
          </div>
          {/*  div4C */}



          {/* Gender checkbox goes here */}
          <GenderCheck onCheckboxChange={checkboxHandler} selectedGender={inputs.gender} />

          <Link to={'/login'} className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block'>
            Already have an account?
          </Link>

          <div>
            <button className='btn btn-block btn-sm mt-2'>Sign Up</button>
          </div>
        </form>

      </div>

    </div>
  )
}

export default Signup
