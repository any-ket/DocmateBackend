const { dbCli } = require('../dal/dbClient');
const { default: MongoDBClient } = require('nodemongodbclient');
const medicationSchedules  = "medicationSchedules"; 
// async function connectToDatabase() {
//   try {
//     // Connect to the MongoDB server
//     await client.connect();

//     // Access the database and collection
//     const database = client.db('mydatabase');
//     const collection = database.collection('medicines');

//     return collection;
//   } catch (error) {
//     console.error('Error connecting to database:', error);
//   }
// }

async function PostMedicines(reqData) {
    const user = reqData.user;
    // const collection = await connectToDatabase();

    try {
      const body = reqData.body;
      const newMedicine = {
        uid: user._id,
        b: body.breakfast,
        l: body.lunch,
        d: body.dinner,
        afterMeal: body.afterMeal

      };
      const result = await dbCli.insert(medicationSchedules, newMedicine);
      return result.ops[0];
    } catch (error) {
      console.error('Error adding medicine:', error);
      return null;
    }
  }
  async function GetMedicines(reqData) {
    // const collection = await connectToDatabase();
    const user = reqData.user;
    try {
      const medicines = await dbCli.find(medicationSchedules, {uid: user._id});
      return medicines;
    } catch (error) {
      console.error('Error fetching medicines:', error);
      return null;
    }
  }
  
  
async function DeleteMedicine(reqData) {
    // const collection = await connectToDatabase();
    const user = reqData.user;
    try {
      const body = reqData.body;
      const result = dbCli.deleteOne(medicationSchedules, { _id: ObjectId(body.medicineId), uid: user._id });
  
      if (result.deletedCount === 1) {
        return { success: true };
      } else {
        return { success: false, message: 'Medicine not found' };
      }
    } catch (error) {
      console.error('Error deleting medicine:', error);
      return { success: false, message: 'Error deleting medicine' };
    }
  }

module.exports = {DeleteMedicine, GetMedicines, PostMedicines };
