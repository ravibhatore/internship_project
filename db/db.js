const{Pool}=require('pg');
const  pool = new Pool({
    host:"localhost",
    user:"postgres",
    port:7000,
    password:"My life",
    database:"postgres"
})

module.exports= pool;
// .finally(()=>
// {
//     client.end;
// })