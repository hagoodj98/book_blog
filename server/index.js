import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from 'axios';
import cors from 'cors';
import env from "dotenv";

const corsOptions = {
  origin:["http://localhost:3000"]
}
const API_URL = "https://openlibrary.org/api/books?bibkeys=ISBN:";
let entries = [];
let currentEntry = 1;
const app = express();
env.config();
async function getNotes(currentEntry) {
  //This accesses the database and grabs the column I want which is the notes.  
  const result = await db.query("SELECT * FROM note JOIN entry ON entry.id  = entry_id where entry_id = $1 ORDER BY note_id ASC; ", [currentEntry]);
  //Then I created an array to use that column of data and returned the array for use
 // console.log(result.rows);
  
  entries = result.rows;
  return entries;
}

//this is called on the homepage to gather all the entries stored in database
async function getCurrentEntry(currentEntry) {
  const result = await db.query("SELECT * FROM entry ORDER BY id ASC");
  entries = result.rows;
  //console.log(entries);
  return entries.find((entry) => entry.id == currentEntry);
}

function getTime() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let weekDay = date.getDay();

  switch (month) {
    case 0:
      month = "January";
      break;
    case 1:
      month = "Febuary";
      break;
    case 2:
      month = "March";
      break;
    case 3:
      month = "April";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "June";
      break;
    case 6:
      month = "July";
      break;
    case 7:
      month = "August";
      break;
    case 8:
      month = "September";
      break;
    case 9:
      month = "October";
      break;
    case 10:
      month = "November";
      break;
    case 11:
      month = "December";
      break;  
  }
  switch (weekDay) {
    case 0:
      weekDay = "Sun";
      break;
    case 1:
      weekDay = "Mon";
      break;
    case 2:
      weekDay = "Tue";
      break;
    case 3:
      weekDay = "Wed";
      break;
    case 4:
      weekDay = "Thur";
      break;
    case 5:
      weekDay = "Fri";
      break;
    case 6:
      weekDay = "Sat";
      break;
  }
  let entry_Date =  weekDay + " " + month + " " + day + "," + " " + year;
  return entry_Date;
}
const db = new pg.Client({
  connectionString: process.env.DBConfigLink,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
//this line makes sure I dont recive an empty object from the client-side
app.use(express.json());
const port = 4000;

app.get("/", async (req, res) => {  
  const result = await getCurrentEntry();
  //const response = await getNotes();

  //console.log(result);
  res.json(entries);
});
app.get("/aboutentry/:id", async (req, res) => {  

  //console.log(req.params);

  const {id} = req.params;

  //console.log(id);

  const result = await getNotes(id);
  //const response = await getNotes();

  //console.log(result);
  res.json(entries);
});
app.post("/aboutentry/:id", async (req, res) => {  

 // console.log(req.params);
  
  //console.log(req.body.note);

  console.log(req.body);

  const {id} = req.params;

  //console.log(id);
  const record = req.body.newNote;

  //console.log(record);

  const noteTable = await db.query("INSERT INTO note (note_submission, entry_id) VALUES($1, $2) RETURNING *", [record, id]);

  

});
app.patch("/aboutentry/:id", async (req, res) => {  

  //console.log(req.params);

  

  //console.log(req.body);
  const updatedNote = req.body.prevNote;
  const id= req.body.id
 // console.log(req.body.note_submission);

  await db.query("UPDATE note SET note_submission = $1 WHERE note_id = $2", [updatedNote, id]);
  
  res.json("note completed");
});

app.delete("/aboutentry/:id", async (req, res) => {  
 

  const deleteNoteId = req.params.id
 
  await db.query("DELETE FROM note WHERE note_id = $1", [deleteNoteId]);
  res.json("entry deleted");

});

app.get("/entry/:id" , async (req, res) => {
 // console.log(req.params);
  const { id } = req.params;
  //console.log(id);


  const result = await db.query("SELECT * FROM entry WHERE id = $1",[id]);

  //console.log(result);

  res.json(result.rows);
});
//this route handles any updates in the notes
app.patch("/entry/:id", async (req, res) => {
  
  //const { id } = req.params;
 // const editSummary = req.body;
  console.log(req.body);

  const {id} = req.params;
  const editSummary = req.body.prevSummary;
  //console.log( req.params+ "....is the id. this is new summary ..." + req.body);
  //console.log(editID + "summary to update");
  try {
  
    await db.query("UPDATE entry SET summary = $1 WHERE id = $2 ", [editSummary, id]);

    res.json("Summary was updated.");

  } catch (error) {
    console.error(error);
  }
 
});

app.delete("/entry/:id", async (req, res) => {
  const {id} = req.params;

  await db.query("DELETE FROM entry WHERE id = $1", [id]);
  res.json("entry deleted");

});

//this handles the input
app.post("/newentry", async (req, res) => {  

  console.log(req.body);

  let isbn = req.body.isbn;
  let summary = req.body.summary;
  

  //console.log(isbn);
  //console.log(summary);
//this try catch checks if the API request sends back data in json, if not then, the request does not exist

try {

    //this is the API request
    const response = await axios.get(`${API_URL}${isbn}&jscmd=data&format=json`);
   // console.log(response);
    
    //this is just a string to tap into the ISBN object from the data we requested
    const isbnObj = `ISBN:${isbn}`;

    //this taps into the property ISBN: allowing access to the properties
    const obj = response.data[isbnObj];
    

    //Convert to string so we can use in application
    const jsonData = JSON.stringify(obj);
    //parse it to get it into the format we want 
    const data = JSON.parse(jsonData);


    //get covers
    let imageMedium = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
    let imageLarge = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    
    ///this if/else statement will handle if there are not authors and subject. Depending on the request, sometimes you may get multiple authors and subjects. These two are declared as an array to get all names and subjects. If the request did not have any authors or subjects, then we would get an error saying authors.length or subjects.length is undefined. The reason being is becasue there were none found. So if they are found do everything here, if not then set subjects and authors both equal to '[Not Found]'

    if (data.authors && data.subjects) {
      let authors = [];
      for (let i=0; i < data.authors.length; i++){
        authors.push(data.authors[i].name);
      }
      ///This catches the subject/s
      let subjects = [];
      for (let i=0; i < data.subjects.length; i++){
        subjects.push(data.subjects[i].name);
      }
      //getting the book key allows us to make another API request to get the work key
      let bookKey = data.key;
      const book = await axios.get(`https://openlibrary.org${bookKey}`);
      //we have the work key and stored it in a variable called workKey
      const workKey = book.data.works[0].key;
      //now that we have the works key. We can make one more API request to get the rating
      const rating = await axios.get(`https://openlibrary.org${workKey}/ratings.json`);
      let ratingAverage;
      let ratingCount;
      //if these are not equal to 0 then set the two variables equal to the value, else, set them equal to 0
      if (rating.data.summary.average && rating.data.summary.count) {
        ratingAverage = rating.data.summary.average;
        ratingCount = rating.data.summary.count;
      } else {
          ratingAverage = 0;
          ratingCount = 0;
      }
      //get title
      let title = data.title;
      //fetch subtitle data
      let subtitle = data.subtitle;
      if (data.subtitle) {
        subtitle = data.subtitle;
      }
      //get publish date
      let publishDate = data.publish_date;
      
      //calling the getTime function in the insert table to get the time

      //pass in all data into the table. The isbn column has an unqiue contraint, so try to insert all this data in the table, but if the isbn already exist, then catch the error and pass in the error in ejs
      try {
        const result = await db.query("INSERT INTO entry (title, summary, image_large_url, image_medium_url, publish_date, authors, rating_average, subjects, rating_count, subtitle, entry_created, isbn) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *", [title, summary, imageLarge, imageMedium, publishDate, authors, ratingAverage, subjects, ratingCount, subtitle, getTime(), isbn]);
        res.json(result.rows[0])
      } catch(err) {
        console.log(err);
        res.json("Entry already exists, try again");

      }
    } else {/////this is the else I mentioned in the beginning of this route
        let authors = ["Not Found"];
        let subjects = ["None Found!"];
        let bookKey = data.key;
        const book = await axios.get(`https://openlibrary.org${bookKey}`);
        const workKey = book.data.works[0].key;
        //now that we have the works key. We can make one more API request to get the rating
        const rating = await axios.get(`https://openlibrary.org${workKey}/ratings.json`);
        let ratingAverage = rating.data.summary.average;
        let ratingCount = rating.data.summary.count;
 
        if (rating.data.summary.average && rating.data.summary.count) {
          ratingAverage = rating.data.summary.average;
          ratingCount = rating.data.summary.count;
        } else {
            ratingAverage = 0;
            ratingCount = 0;
        }
     
        //get title
        let title = data.title;
        //fetch subtitle data
        let subtitle = data.subtitle;
        if(data.subtitle) {
          subtitle = data.subtitle;
        };
        //get publish date
        let publishDate = data.publish_date;
      
        try {
          const result = await db.query("INSERT INTO entry (title, summary, image_large_url, image_medium_url, publish_date, authors, rating_average, subjects, rating_count, subtitle, entry_created, isbn) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *", [title, summary, imageLarge, imageMedium, publishDate, authors, ratingAverage, subjects, ratingCount, subtitle, getTime(), isbn]);
          res.json(result.rows[0])
        } catch (err) {
          console.log(err);
          res.json("Entry already exists, try again");
        }
        
}
} catch (error) {
  console.log(error);
  res.json("Entry does not exist, try again");
}

});
   ///the last 4 routes organizes the data based on recency, popularity, and title order
   app.get("/sortbyrecency", async (req, res) => {
    const result = await db.query("SELECT * FROM entry ORDER BY entry_created ASC");
    entries = result.rows;

    res.json(entries);
  });
  app.get("/sortbyoldest", async (req, res) => {
    const result = await db.query("SELECT * FROM entry ORDER BY entry_created DESC");
    entries = result.rows;
    res.json(entries);
  });
  
   app.get("/sortbytitle", async (req, res) => {
    
    
    const result = await db.query("SELECT * FROM entry ORDER BY title ASC");
    entries = result.rows;
    res.json(entries);
  });
  
  app.get("/sortbyrevelance", async (req, res) => {


  const result = await db.query("SELECT * FROM entry ORDER BY rating_average DESC");
    entries = result.rows;
    
    res.json(entries);
  });


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  