const express=require ('express')
const cors=require('cors')
const mongoose=require('mongoose')
const {ObjectId}=require('mongodb')

const app=express()
app.use(cors())
app.use(express.json())
const db=mongoose.connection
mongoose.connect('mongodb://127.0.0.1:27017/payroll')
.then(console.log('connected'))


// app.get('/admin',(req,res)=>{
//     db.collection('admin').insertOne({name:"amal",password:"123456"})
//     res.send('success')
// })

app.post('/employeeupdate/:email', (req, res) => {
    const email = req.params.email; // Extract the email from req.params
    console.log(email);
    console.log(req.body);
    
    db.collection('employeecards').updateOne(
        { email }, 
        { $set: req.body }, 
        (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).send({ success: false, message: 'Internal Server Error' });
            } else {
                console.log(result);
                res.send({ success: true, message: 'Document updated successfully' });
            }
        }
    );
});

app.post('/leave',async (req,res)=>{
    
    req.body.userid=new mongoose.Types.ObjectId(req.body.userid)
    console.log(req.body.userid, 'request id');
    console.log(req.body,'hgfd');


        
    db.collection('leaveapplication').insertOne(req.body)
    let value=res.json({status:true})
    console.log(req.body);

    // if(value){

    //     data=res.json({status:true})

    // }


})

app.get('/leave/:email',async (req,res)=>{
    const email=req.params.email
    let data=await db.collection('employeecards').findOne( {email: email})
    res.json(data)
    console.log(data);
})
app.get('/leaveapp',async (req,res)=>{
     let data=await db.collection('leaveapplication').find().toArray()
    //  console.log(data);
    res.json(data)
       
       
 })

app.get('/viewemployee/:email', async (req, res) => {
   
    const email=(req.params)
    console.log(email);
    let data=await db.collection('employeecards').findOne(email)
    console.log(data);
    res.json(data)

});




app.post('/admin',async (req,res)=>{

    const {name,password}=req.body
    console.log(req.body );

    const user=await db.collection('admin').findOne({name,password})
    console.log(user);
    if (user){
        res.json({status:true})
    }else{
        res.json({status:false})
    }

})

app.post('/employeegeneration',(req,res)=>{
    db.collection('employeecards').insertOne(req.body)
    res.send('done')
    console.log(req.body);
})



app.post('/employeelogin', async(req,res)=>{

    const {email,number}=req.body
    console.log(req.body);
   const employe=  await db.collection('employeecards').findOne({email,number})
    console.log(employe);
   if(employe){
    res.json({status:true,employe})
   }else{
    res.json({status:false})
   }
})
app.get('/totalemployee',async (req,res)=>{
    let data=await db.collection('employeecards').find().toArray()

        console.log(data);
        res.json(data)
    
})

app.get('/singleemployee/:email', async (req,res)=>{
    let email=req.params;
    let data=await db.collection('employeecards').findOne(email)
     console.log(data);
     res.json(data)
})


app.post('/employeecar/:id', async (req, res) => {
    try {
        console.log(req.body.userid);
        let usrid=new mongoose.Types.ObjectId(req.body.userid)
        var id = new mongoose.Types.ObjectId(req.params.id);
        const salaryDeduction = 500;
        const salarydata=await db.collection('employeecards').findOne({_id:usrid})
        console.log(salarydata,'datas salary');
        let sal=parseInt(salarydata.salary)
    console.log(typeof(salaryDeduction));
        console.log(typeof(sal),'type');
        // Update the employee record
        const data = await db.collection('employeecards').updateOne(
            { _id:id }, 
            { $set: { salary: sal-salaryDeduction } }
            
        );
        const data1 = await db.collection('leaveapplication').updateOne(
            { _id:id, }, 
            { $set: { status: 'approved'}}
    
            
            );
        console.log(data);
        console.log(data1);
        res.json(data);
      
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/leaveapplications/:id', async (req,res)=>{
    
    let id=new mongoose.Types.ObjectId(req.params.id)
    console.log(id);

    await  db.collection('leaveapplication').updateOne(
        { _id:id, }, 
        { $set: { status: 'declined'}}

        
        
        
        )
       
    });




app.post('/empdelt/:email', (req, res) => {
    let email = req.params.email;
    console.log(email);
  
    db.collection('employeecards').deleteOne({ email: email }, (err, result) => {
      if (err) {
        console.error('Error deleting employee:', err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Employee deleted:', result);
        res.send('done');
      }
    });
  });


  app.get('/leaveupdation/:email',async (req,res)=>{
    let email=req.params.email

    let data= await db.collection('leaveapplication').find({email:email}).toArray()
    console.log(data);
    res.json(data)
  })
app.listen(3002)


