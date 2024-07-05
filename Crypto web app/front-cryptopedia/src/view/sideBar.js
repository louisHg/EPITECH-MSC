import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  HomeIcon,
  PhotoIcon,
  Squares2X2Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from './auth'
import { Link, useNavigate } from 'react-router-dom'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function SideBarLink() {
  const auth = useAuth()
  var role = ""
  var session = JSON.parse(sessionStorage.getItem('sessionObject'));
  if (session == null) {
    role = "";
  }
  else{
    role = session.SessionData.user;
  }
  console.log("auth.user " + role);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <div className="flex">
        {/* Narrow sidebar */}
        <div className="hidden w-28 overflow-y-auto bg-indigo-700 md:block">
          <div className="flex w-full flex-col items-center py-6">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=white"
                alt="Your Company"
              />
            </div>
            <div className="mt-6 w-full flex-1 space-y-1 px-2">
              
              <div className=" item.current ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                    'group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium'"><a href= "/Home">Home</a></div>

              <div className=" item.current ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                    'group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium'"><a href="/Article">Article</a></div>

              {
                role == "USER" && (
                  <div className=" item.current ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                    'group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium'"><a href = "/Profile">Profile</a></div> 
                )
              }
              {
                role == "ADMIN" && (
                  <div className=" item.current ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                    'group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium'"><a href = "/Admin/rss">Admin</a></div> 
                )
              }
             </div>
          </div>
        </div>

        {/* Mobile menu */}
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog as="div" className="relative z-20 md:hidden" onClose={setMobileMenuOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-indigo-700 pt-5 pb-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-1 right-0 -mr-14 p-1">
                      <button
                        type="button"
                        className="flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        <span className="sr-only">Close sidebar</span>
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=white"
                      alt="Your Company"
                    />
                  </div>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto px-2">
                    <nav className="flex h-full flex-col">
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Content area */}

      </div>
    </>
  )
}

export default SideBarLink
