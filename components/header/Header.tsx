'use client'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CircleQuestionMark, Grip, Search, Settings } from 'lucide-react'

const Header = () => {

  const [search, setSearch] = useState('')

  return (
    <div className='p-3 bg-[#f8fafd]'>
      <div className="flex items-center justify-between gap-4">
        {/* left side */}
        <div className="relative w-full max-w-2xl">
          <Search className="size-5 text-black font-semibold absolute left-5 top-1/2 -translate-y-1/2 cursor-pointer" />

           <Input
              placeholder='Search in Drive'
              className='w-full rounded-full border placeholder:text-gray-800 placeholder:font-normal bg-[#E9EEF6] pl-14 text-gray-900 text-lg pr-24 h-12 md:text-base focus:bg-white focus:shadow-4xl transition-all duration-200 '
              value={search}
              onChange={(e) => setSearch(e.target.value)}
           />
          <svg  
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="size-8 text-black absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer hover:bg-gray-300 rounded-full p-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          {search && (
            <XMarkIcon
              className='w-6 h-6 text-black absolute right-14 top-1/2 -translate-y-1/2 cursor-pointer'
              onClick={() => setSearch('')}
            />
          )}
        </div>
        
        {/* Right side */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-6">
            <CircleQuestionMark className="w-6 h-6 text-black cursor-pointer hover:text-gray-800" />
            <Settings className="w-6 h-6 text-black cursor-pointer hover:text-gray-800" />
            <Grip className="w-6 h-6 text-black cursor-pointer hover:text-gray-800"/>
          </div>
          
          <div className="flex items-center gap-3 px-3 py-1 rounded-lg border border-gray-300 bg-white cursor-pointer hover:shadow-sm transition-shadow">
            <span className="text-black font-medium">TURING</span>
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center ml-2">
              <span className="text-white font-semibold text-sm">S</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header