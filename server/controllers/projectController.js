require('../models/database');
const res = require('express/lib/response');
const Category = require('../models/Category');
const Project = require('../models/Project');
const User = require('../models/User');
/** 
 * GET /
 * HOMEPAGE
*/
// ['MachineLearning', 'DataScience', 'WebDev', 'AppDev', 'FluidDynamics','ThermoDynamics','MachineDesigning'],
// IoT , App Devlopment , 3D Printing , COA , Web Devlopment , DS  
exports.homepage = async (req, res) => {

  try {
    const limitNnumber = 5;
    const categories = await Category.find({}).limit(limitNnumber);
    const latest = await Project.find({}).sort({ _id: -1 }).limit(limitNnumber);
    const iot = await Project.find({ 'category': 'IoT' }).limit(limitNnumber);
    const appDev = await Project.find({ 'category': 'App Devlopment' }).limit(limitNnumber);
    const printing = await Project.find({ 'category': '3D Printing' }).limit(limitNnumber);
    const webDev = await Project.find({ 'category': 'Web Devlopment' }).limit(limitNnumber);
    const coa = await Project.find({ 'category': 'COA' }).limit(limitNnumber);
    const DS = await Project.find({ 'category': 'DS' }).limit(limitNnumber);
    const food = { latest, iot, appDev, printing, webDev, coa, DS };
    const projectsAll = await Project.find()

    // res.json({ latest, projectsAll })
    res.render('index', { title: 'Projecto- Home', categories, food });
    // res.json(projectsAll)
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}
/**
 * GET /login
 * LOGINPAGE
 * @param {} req 
 * @param {*} res 
 */

exports.loginPage = async (req, res) => {

  try {
    // res.json({ latest, projectsAll })
    res.render('login');
    // res.json(projectsAll)
  } catch (error) {
    res.status(500).json({ message: "Error Occured In Server" });
  }
}


/**
 * 
 * GET /register
 * REGISTER PAGE
 * @param {} req 
 * @param {*} res 
 */

exports.signUPpage = async (req, res) => {
  try {
    // res.json({ latest, projectsAll })
    res.render('register',);
    // res.json(projectsAll)
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}




/** 
 * GET /categories
 * Categories
*/
exports.exploreCategories = async (req, res) => {

  try {
    const limitNnumber = 20;
    const categories = await Category.find({}).limit(limitNnumber);
    res.render('categories', { title: 'Projecto- All_Projects', categories });

  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });

  }
}

/** 
 * GET /categories/:id
 * Categories by Id
*/
exports.exploreCategoriesById = async (req, res) => {

  try {
    let categoryId = req.params.id;
    const limitNumber = 10;
    const categoryById = await Project.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Projecto- Category-Project', categoryById });

  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });

  }
}

/** 
 * GET /project/:id
 * Project
*/
exports.exploreProject = async (req, res) => {

  try {
    let recipeId = req.params.id;
    const project = await Project.findById(recipeId);
    res.render('project', { title: 'Projecto- Projects', project });

  } catch (error) {
    res.send({ message: error.message || "Error Occured" });

  }
}

/**
 * POST /search
 * Search searchProject
 */
exports.searchProject = async (req, res) => {
  //  searchTerm
  try {
    let searchTerm = req.body.searchTerm;
    let project = await Project.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Projecto-Search', project });
    // res.json(project);
  } catch (error) {
    res.send({ message: error.message || "Error Occured" });
  }
}
/** 
 * GET /explore-latest
 *  exploreLatest
*/
exports.exploreLatest = async (req, res) => {

  try {
    const limitNumber = 20;
    const project = await Project.find({}).sort({ _id: -1 }).limit(limitNumber);
    // res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', project } );
    res.json(project);
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}

/**
 * GET / explore-random
 * Explore Random as JSON
 */
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Project.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let project = await Project.findOne().skip(random).exec();

    res.render('explore-random', { title: 'Projecto- Explore Random', project });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}



/**
 * GET /submit-project
 * Submit Project
*/
exports.submitProject = async (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-project', { title: 'Projecto- Uplode Project', infoErrorsObj, infoSubmitObj });
}



/**
 * POST /submit-project
 * Submit Project
*/
exports.submitProjectOnPost = async (req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;
    let ProjectLink;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      })

    }
    const newProject = new Project({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      technology: req.body.ingredients,
      category: req.body.category,
      domain: req.body.domains,
      link: req.body.link,
      image: newImageName
    });
    await newProject.save();
    console.log('project has been submited')
    req.flash('infoSubmit', 'Project has been added.')
    res.redirect('/submit-project');
  } catch (error) {
    res.json(error);
    req.flash('infoErrors', error);
    // res.redirect('/submit-project');
  }
}


exports.registerUser = async (req, res) => {
  try {
    let email = req.body.email;
    let name = req.body.name;
    let password = req.body.password;
    if (!email || !name || !password) {
      console.log('Email or Name or Password Missing');
      res.json({
        status: 400,
        message: 'Email or Name or Password Missing'
      })
    } else {
      console.log('user detailed valid!!')
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      university: req.body.university,
    });
    await newUser.save();
    // req.flash('infoSubmit', 'Project has been added.')
    res.redirect('/');
    // res.render('index', { title: 'Projecto- Home', categories, food });
  } catch (error) {
    // res.json(error);
    // req.flash('infoErrors', error);
    // res.redirect('/login');
    res.json({
      status: 500,
      message: 'User Login failed'
    });
  }
}


exports.loginUser = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    console.log(email + password);
    if (!email || !password) {
      console.log('Email or Name or Password Missing');
      res.json({
        status: 400,
        message: 'Email or Name or Password Missing'
      })
    } else {
      console.log('user detailed valid!!')
    }

    let currUser = await User.findOne({ email: req.body.email, password: req.body.password });
    console.log(currUser);
    if (!currUser) {
      res.json({
        status: 400,
        message: 'User not found'
      })
    } else {

      res.redirect('/');
      // res.json({
      //   status: 200,
      //   message: 'User loggedIn Succesfully'
      // })
      // console.log('User Logged In Successfully');
    }
  } catch (error) {
    // res.redirect('/login');
    res.json({
      status: 500,
      message: 'User Login failed due to' + error.message,

    });
  }
}


