'use client'
import React, { useEffect, useLayoutEffect } from 'react'
import AddCategory from './AddCategory' 
import CategoryItem from './CategoryItem'
import { useSession } from 'next-auth/react';
import { fetchCategory } from '@/helpers/fetchCategory';

export default function CategoryComponent() {  
  const [categories, setCategories] = React.useState([]);
  
  const refreshCategories = async () => { 
      try {
        const data = await fetchCategory();
        setCategories(data.categories);
      } catch (err) {
        console.log('error in fetching category', err);
      } 
  };
  
  useLayoutEffect(() => {
    refreshCategories(); 
  }, []);
   
  
  return (
    <div className='p-5 space-y-2 max-[1100px]:mx-auto max-[700px]:w-full max-[1100px]:w-fit'>
      <AddCategory onAddSuccess={refreshCategories}/>
      <CategoryItem categories={categories} onEditSuccess={refreshCategories}/>
    </div>
  )
}
