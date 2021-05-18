# JAI SHREE RAM

# create a form

Modeling it like a portal for applying to a position. 

- Fields (total 10 fields, assume the rest)
  - *email* [API-1] it's the key
  - *Password*
  - *Date* [API-4] - Should be current date or what? - </atleast-one>
  - *Image Upload* [API-5] - Candidate Image
  - *PDF File Attachment* - Resume file  </atleast-one>
  - *Name* and *other fields*  - details about the candidate 
- should be able to **embed** this form in other websites **using iframe**
- should collect all info at one place - obviously a central database, thinking mongoDB [API-2]


# a "grid" to view and edit the forms 
- grid is basically an excel sheet that can be edited
- grid functionalities
  - 5 fields shown by default, should be able to configure which fields to show [API-3]
  - **filter** **sort** and **search** records wrt all fields (including the one mentioned below)  [API-6]
  - an extra **'note' field** with each record that stays in the database for admin reference but isn't shown to the form rendered on the website [API-3]
  - a container (field?) with each record to 'create' and '**assign tags** [API-3]
- user login and password for admin access [API-3]


# API (RESTful)  / Microsevices
1. **email** is the **primary key** - WHAT DO YOU MEAN BY THAT 
2. collecting and **saving form data** - this is obvious? form data submitted should go to the database
3. **Grid UI** 
   1. **getting data** from DB and **showing it** in tabular form
   2. the intially "empty" **notes** field which will be present in admin view. Allow the admin to add notes from the UI and update it in the DB.
   3. creating and assigning **tags**
4. **repeated submission** 
   1. update form data with the **latest details**
   2. maintain a log of date of the submissions
   3. I think this is where the **email being primary key** will help to distinguish between an update or a new form [APi-1]
5. **thumbnail of image**
   1. generate it
   2. save it (to the database ofcourse)
   3. preview it to the user when submitting ??
6. **Search method** to find candidates based on the form fields.


# doubts
1. The date field in the form, should it contain the current date (at the time of submitting the form, which I think should be populated right before when you press the submit button) or some other date maybe like DOB. Need to know this for the case of repeated submissions.
2. When should I showcase the thumbnail of uploaded image? Before submission or after submission? Ideally it should be before submission! 


# intuition
- lookup how to create a form (Google Form clone something) using MERN
  - including a login page - how should we implement that? as in using mongo or a social media login?
 


# in simple words
- ek form banana hai kuch feilds hai usme
- iss form ko kisi bhi website me ghusa sakte hai
- form ke submissions saare mongoDB me jayenge
- ab koi UI (website) hona chahiye form ki entries ko dekhne ke liye
- iss website me admin login karega, and they should be able to add some comments for any record
- form dobara dobara submit kar sakte hai, latest info retain karni hai, admin ke notes and all bhi sath hi sath DB me dalna hai. submissions ki date kisi array me store karte rehna, baad me render karne ka soch lena



# in exteremly simple words
- ek google form (embeddable) + google sheet wala system banana hai


# webapp ka flow
- kisi bhi jagha pe apna form (simple html types) hoga 
  - isme image preview ke liye *dekhna padega* scene
- form ka data submit karna hai (unique element being the email) - node pe jayega - fir mongoDB - dobara submissions par update after marking date
- website par login karo, and react DB ka data page par display karega
  - ussi page par hidden fields (notes, tags - iska implemetation *dekhna padega*, dates of submissions) dikhenge
  - notes and tags editable bhi honge, edit karne ke thik baad DB pe update honge
  - search sort filter kar sakte hai, fields-to-view change kar sakte hai
 



axios.get and axios.post - for get and post, api endpoints 

create 

