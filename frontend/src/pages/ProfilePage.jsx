import { useEffect, useState } from 'react'
import { useUserStore } from '../stores/useUserStore'

import EditProfileModal from "../components/EditProfileModal"
import PastOrders from './PastOrders'

const ProfilePage = () => {
    const { user, loading } = useUserStore()

    const [showPastOrders, setShowPastOrders] = useState(false)


    return (
        <div>
            <p>EditProgile page</p>
            <EditProfileModal user={user} />

            <div>
                <button 
                    onClick={() => setShowPastOrders(!showPastOrders)}
                    className="flex btn rounded-lg btn-sm border border-white bg-emerald-600 w-1/4 mx-auto py-2 my-2 justify-center"
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