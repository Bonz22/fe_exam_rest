const config = require('./config');
const express = require('express');
const Promise = require('promise');
const mysql = require('mysql');
const pool = mysql.createPool(config.mysql);
const app = express();
const http = require('http').Server(app);

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

let getRecords = () => {
	return new Promise((resolve, reject)=>{
		pool.getConnection(function(err,connection){
			if(err){
				return reject(err);
			};
			connection.query('SELECT * FROM calendar',(error,result)=>{
				connection.release();
				if(error){
					console.log({error});
					return reject(error);
				};
				resolve(result);
			});
		});
	});
};

let updateRecords = (req) => {
	return new Promise((resolve, reject)=>{
		pool.getConnection(function(err,connection){
			if(err){
				return reject(err);
			};
			let q = `UPDATE calendar SET event = ?, date_created = ? WHERE id = ?`;
			connection.query(q, [req.body.event, req.body.date, req.body.id],(error,result)=>{
				connection.release();
				if(error){
					console.log({error});
					return reject(error);
				};
				resolve(result);
			});
		});
	});
};

let deleteRecords = (id) => {
	return new Promise((resolve, reject)=>{
		pool.getConnection(function(err,connection){
			if(err){
				return reject(err);
			};
			let q = `DELETE FROM fe_exam.calendar WHERE id = ?`;
			connection.query(q, id,(error,result)=>{
				connection.release();
				if(error){
					console.log({error});
					return reject(error);
				};
				resolve(result);
			});
		});
	});
};

let createRecord = (req) => {
	return new Promise((resolve, reject)=>{
		pool.getConnection(function(err,connection){
			if(err){
				return reject(err);
			};
			let q = `INSERT INTO fe_exam.calendar(event, date_created) VALUES (?, ?) `;
			connection.query(q, [req.body.event, req.body.date],(error,result)=>{
				connection.release();
				if(error){
					console.log({error});
					return reject(error);
				};
				resolve(result);
			});
		});
	});
};

app.get('/get',(req,res)=>{
	res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
	getRecords().then((result)=>{
		res.json(result);
	})
	.catch((error)=>{
		res.json(error);
	});
});

app.post('/update',(req,res)=>{
	res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
	updateRecords(req).then((result)=>{
		//console.log({result});
		res.json({
			status: (result.affectedRows > 0) ? 'Update Success' : 'Update Failed'
		});
	})
	.catch((error)=>{
		res.json(error);
	});
});

app.delete('/delete/:id',(req,res)=>{
	res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
	deleteRecords(req.params.id).then((result)=>{
		res.json({
			status: (result.affectedRows > 0) ? 'Record Deletion Successful' : 'Record Deletion Failed'
		});
	})
	.catch((error)=>{
		res.json(error);
	});
});

app.put('/create',(req,res)=>{
	res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
	createRecord(req).then((result)=>{
		res.json({
			status: (result.affectedRows > 0) ? 'Record Creation Successful' : 'Record Creation Failed'
		});
	})
	.catch((error)=>{
		res.json(error);
	});
});

app.use((req,res,next)=>{
    res.status(404).render('error',{title: 'Page Not Found!', header_error: 'Oops!', error_message: "We can't seem to find the page you're looking for"});
});

http.listen(config.server.port,()=>{
    console.log('Server running on port ' + config.server.port);
});