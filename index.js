const express = require('express');
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());


// 
const { MongoClient } = require('mongodb');
const { json } = require('express/lib/response');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gdmzp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
	try{
		await client.connect();

		const database = client.db("innof-db");
    	const CollectionUsers 		= database.collection("users");
    	const CollectionServices 	= database.collection("services");
    	const CollectionOrders 		= database.collection("orders");
    	const CollectionTeamMember	= database.collection("teams");
    	const CollectionReviews		= database.collection("reviews");
		
		/**
		 * ***********************
		 * ALL POST API
		 * ********************
		 */


		/**
		 * GET API
		 * Get USER Data
		 */
		
		 app.get("/users", async (req,res)=>{
			const cursor = CollectionUsers.find({});
			const users = await cursor.toArray();
			res.json(users);
		})

		/**
		 * GET API
		 * CHECK USER ROLE API
		 */

		app.get("/users/:email", async (req, res)=>{
			const email = req.params.email;
			const query = { email : email };
			const user = await CollectionUsers.findOne(query);
			let isAdmin = false;
			if(user?.role === 'admin'){
				isAdmin = true;
			}
			res.json({ admin: isAdmin})
		})

		/**
		 * GET API
		 * Get Service Data
		 */
		
		app.get("/services", async (req,res)=>{
			const cursor = CollectionServices.find({});
			const services = await cursor.toArray();
			res.json(services);
		})

		/**
		 * GET API
		 * Get Service Data by ID
		 */

		app.get("/service/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const singleService = await CollectionServices.findOne(query);
			res.send(singleService);
		  });

		
		/**
		 * GET API
		 * Get My Orders Data by email
		 */
		
		 app.get("/myorders", async (req, res) => {
			const email = req.query.email;
			const query = { email : email };
			const cursor =  CollectionOrders.find(query);
			const myorders = await cursor.toArray();
			res.json(myorders);
		})
		
		/**
		 * GET API
		 * Get ALL Orders Data
		 */
		
		 app.get("/manageorders", async (req, res) => {
			const cursor =  CollectionOrders.find({});
			const manageorders = await cursor.toArray();
			res.json(manageorders);
		})

		/**
		 * GET API
		 * Get ALL Team Member Data
		 */
		
		 app.get("/team-members", async (req, res) => {
			const cursor =  CollectionTeamMember.find({});
			const teamMember = await cursor.toArray();
			res.json(teamMember);
		})

		/**
		 * GET API
		 * Get ALL Reviews Data
		 */
		
		app.get("/reviews", async (req, res) => {
			const cursor =  CollectionReviews.find({});
			const reviews = await cursor.toArray();
			res.json(reviews);
		})


		/**
		 * ***********************
		 * ALL POST API
		 * ********************
		 */

		/**	
		 * POST API
		 * Add Users to Database
		 */
		 app.post("/users", async (req, res) => {
			const user = req.body;
			const result = await CollectionUsers.insertOne(user);
			res.send(result);
		  });

		  /**	
		   * POST API
		   * Add Servces in Database
		   */
		   app.post("/services", async (req, res) => {
			  const newServices = req.body;
			  const result = await CollectionServices.insertOne(newServices);
			  res.send(result);
			});

		  /**	
		   * POST API
		   * Add Team Member in Database
		   */
		   app.post("/team-members", async (req, res) => {
			  const newMember = req.body;
			  const result = await CollectionTeamMember.insertOne(newMember);
			  res.send(result);
			});


		/**	
		 * POST API
		 * Add Order from single product page
		 */
		 app.post("/orders", async (req, res) => {
			const newOrder = req.body;
			const result = await CollectionOrders.insertOne(newOrder);
			res.send(result);
		});

		/**	
		 * POST API
		 * Add Review page
		 */
		app.post("/reviews", async (req, res) => {
			const newReviews = req.body;
			const result = await CollectionReviews.insertOne(newReviews);
			res.send(result);
		});

		
		/**
		 * ***********************
		 * ALL UPDATE API
		 * ********************
		 */

		/**
		 * INSERT USER DATA ON FIRST TIME LOGIN
		 */

		 app.put("/users", async (req, res) => {
			const user = req.body;
			const filter = { email : user.email };
			const options = { upsert : true };
			const updateDoc = {	$set : user }
			const result = await CollectionUsers.updateOne(filter,updateDoc, options);
			res.json(result)
		})

		/**
		 * PUT API
		 * MAKE USER ADMIN API
		 */

		 app.put("/users/admin", async (req, res) => {
			const user = req.body;
			const filter = { email : user.email };
			const updateDoc = {	$set : { role : "admin"} }
			const result = await CollectionUsers.updateOne(filter,updateDoc);
			res.json(result)
		})

		/**
		 * PUT API
		 * CHANGE USER ROLE
		 */

		 app.put("/users/role/:id", async (req, res) => {
			const id = req.params.id;
			const role = req.body.role;
			const filter = { _id: ObjectId(id) };
			const updateDoc = {	$set : { role : role } }
			const result = await CollectionUsers.updateOne(filter,updateDoc);
			res.json(result)
		})

		/**
		 * PUT API
		 * CHANGE ORDER STATUS
		 */

		app.put("/manageorders/status/:id", async (req, res) => {
			const id = req.params.id;
			const status = req.body.status;
			const filter = { _id: ObjectId(id) };
			const updateDoc = {	$set : { status : status } }
			const result = await CollectionOrders.updateOne(filter,updateDoc);
			res.json(result)
		})

		/**
		 * ***********************
		 * ALL DELETE API
		 * ********************
		 */

		/**
		 * DELETE API
		 * Delete Service Data
		 */
		 app.delete("/services/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await CollectionServices.deleteOne(query);
			res.json(result);
		})
		/**
		 * DELETE API
		 * Delete an Order
		 */
		 app.delete("/manageorders/delete/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await CollectionOrders.deleteOne(query);
			res.json(result);
		})


	} finally{
		//await client.close();
	}
	
}
run().catch(console.dir())



app.get('',(req,res)=>{
	res.send('hello from express')
})


app.listen(port,()=>{
	console.log('listeing to port',port)
})