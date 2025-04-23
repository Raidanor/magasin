import { useEffect, useState } from 'react'
import { useUserStore } from '../stores/useUserStore'

const EditProfileModal = ({user}) => {
    const { updateProfile, loading } = useUserStore()

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
    })

    useEffect (() => {
        if (user) {
            setProfileData({
                phoneNumber: user.phoneNumber,
                address: user.address,
                name: user.name,
                email: user.email,
                

            })
        }
        
    }, [user])

    const handleInputChange = (e) =>
    {
        setProfileData({...FormData, [e.target.name]: e.target.value})
    }
    
    return(
        <div className=''>
            <button 
                className="flex btn rounded-lg btn-sm border border-white bg-emerald-600 w-1/4 mx-auto py-2 my-2 justify-center"
                onClick={() => document.getElementById("edit_profile_modal").showModal()}
            >
                Edit Profile
            </button>


            <dialog id="edit_profile_modal" className="modal bg-emerald-900/90 mx-auto w-11/12 md:w-1/2 lg:w-2/3 my-auto border-gray-300 border-b border-l border-r rounded-md">
                <div className="modal-box border-t border-gray-300 shadow-ms py-3 px-5 text-white">
                    <h3 className="font-bold text-lg mb-2 ">Update Profile</h3>
                    <form 
                        className=""
                        onSubmit={(e) => {
                            e.preventDefault()
                            updateProfile(profileData)
                        }}
                    >
                        <div className="">
                            <div className='flex flex-col py-1'>
                                <div className='w-1/2 my-auto'>Name: &nbsp;</div>
                                <input 
                                    name="name"
                                    type="text"
                                    placeholder="Name"
                                    className="input border border-gray-300 rounded p-2 input-md w-full bg-emerald-950"
                                    value={profileData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                        
                            <div className='flex flex-col py-1'>
                                <div className='w-1/2 my-auto'>Email: &nbsp;</div>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    className="input border border-gray-300 rounded p-2 input-md w-full bg-emerald-950"
                                    onChange={handleInputChange}
                                    value={profileData.email}
                                />
                            </div>
                            <div className='flex flex-col py-1'>
                                <div className='w-1/2 my-auto'>Address: &nbsp;</div>
                                <input
                                    name="address"
                                    type="text"
                                    placeholder="Address"
                                    className="input border border-gray-300 rounded p-2 input-md w-full bg-emerald-950"
                                    value={profileData.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className='flex flex-col py-1'>
                                <div className='w-1/2 my-auto'>Phone Number: &nbsp;</div>
                                <input
                                    name="phoneNumber"
                                    type="number"
                                    placeholder="Phone Number"
                                    className="input border border-gray-300 rounded p-2 input-md w-full bg-emerald-950"
                                    value={profileData.phoneNumber}
                                    onChange={handleInputChange}
                                />  
                            </div>

                        </div>
                        <button className="flex btn rounded-lg btn-sm border border-white bg-emerald-600 w-1/4 mx-auto py-2 my-2 justify-center">
                            {loading ? "Updating" : "Update"}
                        </button>
                    </form>
                    
                </div>
                <form method="dialog" className="modal-backdrop bg-red-800">
                    <button className="flex outline-none btn btn-sm border-t border-gray-400 bg-red-800 w-full mx-auto py-2 justify-center h-full">
                        Close
                    </button>
                </form>
            </dialog>
        </div>
    )
}

export default EditProfileModal