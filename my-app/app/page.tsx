'use client';
import React, {useState, useEffect, Fragment} from "react"
import Image from "next/image";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import EditSummary from './components/EditSummary';
import styles from './styles/home.module.css';
import StarIcon from '@mui/icons-material/Star';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Footer from './components/footer';
import { Work_Sans, Anton } from "next/font/google";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import {Metadata} from 'next';

const antonSC = Anton({
subsets: ['latin'],
display: 'swap',
weight: '400',

})
const worksans =  Work_Sans({
  subsets:['latin'],
  display: 'swap',
})


export default function Home() {
const [entries, setEntries] = useState([]);

const sortByTitle = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/sortbytitle`);
    console.log(response);
    
    setEntries(response.data);
  } catch (error) {
    console.log(error);
  }
}
const sortByRecency = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/sortbyrecency`);
    console.log(response);
    
    setEntries(response.data);
  } catch (error) {
    console.log(error);
  }
}
const sortByOldest = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/sortbyoldest`);
    console.log(response);
    
    setEntries(response.data);
  } catch (error) {
    console.log(error);
  }
}
const sortByRevelance = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/sortbyrevelance`);
    console.log(response);
    
    setEntries(response.data);
  } catch (error) {
    console.log(error);
  }
}


const getEntries = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/`);
    console.log(response);
    
    setEntries(response.data);
  } catch (error) {
    console.log(error);
  }
}

  useEffect(() => {
    getEntries();
},[]);

const deleteSummaryAPI = async (id) => {
  console.log(id + "summary to delete");
   try {
       const deleteSumary = await axios({
           method:'delete',
           url: `http://localhost:4000/entry/${id}`,
           });
           setEntries(entries.filter(entry => entry.id !== id));
   } catch (error) {
     console.log(error);
     
   }
 }
  return ( 
      <div>
        <div className={styles.header}>
          <div className={antonSC.className}>
            <h1 className="text-center"><AutoStoriesIcon fontSize="large" /> Jaiquez Book Blog</h1>

          </div>
        </div>
        <div className={styles.sortnav}>
          <div className={antonSC.className}>
            <h3 className="mx-2">Sort By:</h3>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <div  className={styles.navsorts}>
            <Button className={worksans.className} onClick={sortByTitle} variant="text"> <h6> Title</h6></Button>
            <Button className={worksans.className} onClick={sortByRecency} variant="text"><h6>Latest</h6></Button>
            <Button  className={worksans.className} onClick={sortByOldest} variant="text"> <h6>Oldest</h6></Button>
            <Button className={worksans.className} onClick={sortByRevelance} variant="text"> <h6>Most Popular</h6></Button>
            </div>
          </div>
        </div>
        {entries.map((entry, index) => (
          <div  key={index}>
            <div className="container">
              <div className={styles.entry}> 
                <div className="d-flex justify-start  justify-content-md-end">
                  <IconButton onClick={() => deleteSummaryAPI(entry.id)} className={styles.delete} aria-label="delete" size="large">
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </div>
                <div className=" d-flex flex-column gap-3 flex-md-row">
                  <div className={styles.div}>
                    <div className="d-flex flex-column align-items-center">
                      <div className={styles.img}>
                        <img src={entry.image_large_url} className="img-fluid" alt= {entry.title }   />
                      </div>
                      <div className="mt-3">
                        <h1 className={worksans.className}>{entry.rating_average}<sup> /5<StarIcon className={styles.star}/></sup></h1>
                      </div>
                    </div>
                  </div>
                  <div className={styles.div}>
                    <div className=" p-3">
                      <div className={antonSC.className}>
                        <h2 className={styles.h2 }>{entry.title} by {entry.authors.slice(2,entry.authors.length - 2)}</h2>
                      </div>
                      <p className={worksans.className}>{entry.summary} <EditSummary id={entry.id} entrySummary={entry.summary} /></p>
                      <p className={worksans.className}>Started reading on: <span className={styles.time}>{entry.entry_created}</span></p>
                      <Link href={`/entry/${entry.id}`} color="inherit"><Button className={styles.readmore} variant="outlined"><span className={worksans.className}>Read More</span></Button></Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>  
        ))}
        <div className="d-flex justify-center p-2">
          <Link href="/findentry"><Button className={styles.add}><AddIcon fontSize="large" /></Button></Link>
        </div>
        <Footer />
      </div>
  );
}