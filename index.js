const express=require ('express');
const app=express();
const cors=require('cors');
const path = require('path');
const PORT=process.env.PORT || 3000;

//middleware 
app.use(cors());
app.use(express.json());

if(process.env.NODE_ENV === 'production'){
    //server static content 
    app.use(express.static(path.join(__dirname,'client/build')));
}

app.use('/auth',require('./Route/login_register'));
app.use('/dashboard',require('./Route/dashboard'));

//

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client/build/index.html'))
});



app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})