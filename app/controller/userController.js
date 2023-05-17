const DbConnection = require('../db')
const connection = DbConnection

const findUser= async(tableName, where)=>{
    try {
        // console.log('coming for find user');
        const user  = await connection.query(`select * from public.${tableName} where "phonenumber" = $1`,[where])
        // console.log('log');
        return user.rows[0]
    } catch (error) {
        res.status(400).json({message :'error ocuurerd', error})
    }
}

const createUser = async(user)=>{
    try {
        // console.log('coming for createUser part in userController');
        const updateCols = Object.keys(user)
        let cols = []
        let values = []
        updateCols.forEach((element,index) => {
            cols.push(`$${index+1}`)
            values.push(user[element])
        });
        const wrappedQuotes = updateCols.map((element)=>{
            `"${element}"`
        })
        // console.log('before create user');
        // console.log(cols);
        // console.log(values);
        // console.log(wrappedQuotes);
        // const newUser = await connection.query(`insert into public.user (${wrappedQuotes.join(',')}) values (${cols.join()}) returning *`,values)
        const newUser = await connection.query(`insert into public.user ("phonenumber","password") values ($1,$2) returning *`,[user.phoneNumber,user.hashedPassword])
        // delete newUser.rows[0].password
        // delete newUser.rows[0].token
        // console.log(newUser.rows[0]);
        return newUser.rows[0]
    } catch (error) {
        res.status(400).json({message :'error ocuurerd', error})
    }
    
}

const updateUser = async(tableName, updateValue, where)=>{
    try {
        const update = await connection.query (`update public.${tableName} SET "token"=$1 where "userid"= $2 returning *`,[updateValue,where])
        return update.rowCount == 0 ? false: true
    } catch (error) {
        console.log(error);
        res.status(400).json({status : 400, message :'error occured', error})
    }

}

module.exports = {findUser,createUser,updateUser}