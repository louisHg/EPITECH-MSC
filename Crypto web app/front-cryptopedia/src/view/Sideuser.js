import { Fragment, useState, React } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { useAuth } from "./auth";

export const SideUser = () => {
    const auth = useAuth()
    console.log("auth user " + auth.user);
    var session = JSON.parse(sessionStorage.getItem('sessionObject'));
    if (session == null) {
        token = "";
    }
    else{
        var token = session.SessionData.user;
        var userId = session.SessionData.user_id
      }
    console.log(token + " // " + userId);
    const [setMobileMenuOpen] = useState(false)
    const handleLogout = () => {
        console.log("logOut");
        auth.logout();
        window.location = ('Log')
    }
    return (

        <div className="">
            <div className="relative  LogoProfile"> {/* classe pour div gene marTop 5px forexp */}
                <button
                    type="button"
                    className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                    onClick={() => setMobileMenuOpen(true)}>
                    <span className="sr-only">Open sidebar</span>
                    <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="flex flex-1 justify-between px-4 sm:px-6">
                    <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6">
                        {/* Profile dropdown */}
                        <Menu as="div" className="relative flex-shrink-0">
                            <div>
                                <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src={require('../add/logoCrypto.png')}
                                        alt="CryptoPedia"
                                    />
                                </Menu.Button>
                            </div>
                            <Transition as={Fragment}>
                                <Menu.Items className="">
                                    <nav>
                                        <ul>
                                            <li>
                                                <a href='/'>Home</a>
                                            </li>
                                            <li>
                                                <a href='Register'>Register</a>
                                            </li>
                                            <li>
                                                {
                                                    !auth.user && (
                                                        <a href='/Log'>
                                                            Log-in
                                                        </a>
                                                    )
                                                }
                                                {
                                                    auth.user && (
                                                        <button onClick={handleLogout}>
                                                            Log-out
                                                        </button>
                                                    )
                                                }
                                            </li>
                                        </ul>
                                    </nav>
                                </Menu.Items>
                            </Transition>
                        </Menu>

                    </div>
                </div>
            </div>

        </div>
    )
}
export default SideUser