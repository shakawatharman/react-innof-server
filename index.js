const express = require('express');
const app = express();
const cors = require("cors");
const port = 4000;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// innofdbuser
// hkLb53A5d5GgoJOS
const { MongoClient } = require('mongodb');
const { json } = require('express/lib/response');

const uri = "mongodb+srv://innofdbuser:hkLb53A5d5GgoJOS@cluster0.gdmzp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
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