import { useEffect, useState } from 'react'
import { useUserStore } from '../stores/useUserStore'

import EditProfileModal from "../components/EditProfileModal"
import PastOrders from '../components/PastOrders'

const ProfilePage = () => {
    const { user } = useUserStore()

    const [showPastOrders, setShowPastOrders] = useState(false)

    useEffect(() => {
        console.log(user)
    }, [user])

    return (
        <div>
            <EditProfileModal user={user} />

            <div>
                <button 
                    onClick={() => setShowPastOrders(!showPastOrders)}
                    className="flex btn rounded-lg btn-sm border border-white bg-blue-800 w-1/4 mx-auto py-2 my-2 justify-center"
                >
                   { showPastOrders ? "Hide past orders" : "Show past orders"}
                </button>
                { showPastOrders &&
                    <PastOrders />
                }
            </div>
        </div>
    )
}

export default ProfilePage