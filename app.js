const express = require('express');
var mysql = require('mysql');
const util = require( 'util' );
var app = express();
const bodyParser = require("body-parser");
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'runner'
}); 

// test 
function makeDb( connection ) {
  const connections = connection;
  return {
    query( sql, args ) {
      return util.promisify( connections.query )
        .call( connections, sql, args );
    },
    close() {
      return util.promisify( connections.end ).call( connections );
    }
  };
}




app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json()); 
 
connection.connect(function(error) {
  if(!!error) {
    console.log('Error');
  }
 else {
    console.log('Connected');
  }
});


app.get('/pfeapi/loginapi', function(req, resp){
  var email = req.query.email
  var motdepasse = req.query.motdepasse
  //var motdepasse = req.body.motdepasse
  console.log("l'mail est ",email)
  console.log(motdepasse)
  // var email = "ahmedsouissi06@gmail"
  // var motdepasse = "azerty"
      connection.query("SELECT * FROM USER where email ='"+email+"' and motDePasse = '"+motdepasse+"'", function(error, rows, fields){
        if(!!error){
          console.log('Error in the query');
          var respBody = {"error":2, "user":null};
          //var respRow = {"user":null};
          resp.json(respBody);
        } else {
            if (rows.length == 0) {
              var respBody = {"error":1,"user":null};
              resp.json(respBody);
            }
            else {
                  // console.log(rows.length);
              console.log('Successful query');
              //parse with your rows/fields
              console.log('resluat est '); 
              console.log('le resultat est ',rows);
              var respBody = {"error":0,"user":rows[0]};
              //var respRow = {"user":rows[0]};
              resp.json(respBody);
            }
           
        }
      });
})



app.get('/pfeapi/mainapi', async function(req,resp){
  var userId = req.query.id;
  if (userId == null ){
    console.log("erreur in parametre") ; 
    // var respBody = {"error":3,"events":null};
    // // resp.json(respBody);
    // return respBody ;
  }
  calendarModel = await getEvent(userId,1); 
  eventsModel = await getEvent(userId,0) ; 
  accesModel = await getAccesDemande(userId);
  eventsModel.accessModel = accesModel
  console.log("aftersql") ;
  respBody = {"calendarModel":calendarModel, "eventsModel": eventsModel}; 
  resp.json(respBody);

})

async function getEvent(userId,isCalendar) {
  let date = new Date();
  let dateString = stringDate(date)[0];
  console.log(userId)
  console.log(dateString)
  const db = makeDb(connection);
  var queryString = "" ;
  if (isCalendar == 0) {
    queryString = "SELECT  e.*  FROM EVENT e, Event_User eu where e.id = eu.fk_event_id AND eu.fk_user_id = '"+userId+"' " ;
  }
  else {
    queryString = "SELECT * FROM EVENT  where date >= '"+dateString+"' AND id NOT IN (Select fk_event_id from Event_User where fk_user_id = '"+userId+"' )";
  }
  try {
    const events = await db.query(queryString);
    // if (events.length == 0) {
    //   var respBody = {"error":1,"events":null};
    //   return respBody ;
    //   // resp.json(respBody);
    // }
    // else {

      var eventHistory = []; 
      var upcomingEvent = []; 
      var j = 0 ; 
      var k = 0 ;

      for (var i in events){

          var isoDate = events[i].date ; 
          console.log(isoDate);
          var newDate = new Date(isoDate);
          console.log("new date = "+ newDate);
          var dateTime = stringDate(newDate);
          console.log("dateTime = "+ dateTime);
          if (date > newDate){
            events[i].isOver = 1;
          }
          else {
            events[i].isOver = 0;
          }
          
          events[i].date = dateTime[0] ; 
          events[i].heurdepart = dateTime[1] ; 
          const countRow = await db.query("SELECT count(*) nbrInscrit FROM Event_User where fk_event_id = '"+events[i].id+"'");
          var latlong = await db.query("SELECT latitude, longitude from Coordinate where fk_event_id = '"+events[i].id+"'");
          events[i].coordonner = latlong ; 
          events[i].nbrInscrit = countRow[0].nbrInscrit ; 
          if(isCalendar == 0) {
            if(events[i].isOver == 1) {
              eventHistory[j] = events[i] ;
              j++;
            }
            else {
              upcomingEvent[k] = events[i] ;
              k++
            } 
          }
      }

      console.log(events);
      if(isCalendar == 1) {
        var respBody = {"error":0,"events":events};
      }
      else {
        var respBody = {"eventsHistoryModel":{"error":0,"events":eventHistory},"upcomingEventModel":{"error":0,"events":upcomingEvent}}
      }
      
      return respBody;
      // resp.json(respBody);
    // }
  } catch (err) {
    console.log(err);
    var respBody = {"error":2,"events":null};
    return respBody ;
    // resp.json(respBody);
  }
}

async function getAccesDemande(userId) {
  let date = new Date();
  let dateString = stringDate(date)[0];
  console.log(userId)
  console.log(dateString)
  const db = makeDb(connection);
  queryString = "SELECT  e.* , a.etat FROM EVENT e, Acces_User_Event a where e.id = a.fk_event_id AND a.fk_user_id = '"+userId+"' " ;
  try {
    const events = await db.query(queryString);
    // if (events.length == 0) {
    //   var respBody = {"error":1,"events":null};
    //   return respBody ;
    //   // resp.json(respBody);
    // }
    // else {
      var demandeAcces = [] ;

      for (var i in events){

          var isoDate = events[i].date ; 
          var newDate = new Date(isoDate);
          console.log("new date = "+ newDate);
          var dateTime = stringDate(newDate);
          console.log("dateTime = "+ dateTime);
          if (date > newDate){
            events[i].isOver = 1;
          }
          else {
            events[i].isOver = 0;
          }
          
          events[i].date = dateTime[0] ; 
          events[i].heurdepart = dateTime[1] ; 
          const countRow = await db.query("SELECT count(*) nbrInscrit FROM Event_User where fk_event_id = '"+events[i].id+"'");
          events[i].nbrInscrit = countRow[0].nbrInscrit ; 
          var accessEtat = events[i].etat ; 
          delete events[i].etat ; 
          var demandeAccesElement = {"event": events[i], "etatAcces": accessEtat} ; 
          demandeAcces[i] = demandeAccesElement ; 
      }

      console.log(events);
      var respBody = {"error":0,"events":demandeAcces};
      return respBody;
      // resp.json(respBody);
    // }
  } catch (err) {
    console.log(err);
    var respBody = {"error":2,"events":null};
    return respBody ;
    // resp.json(respBody);
  }
}



///TESTDOWN


app.get('/pfeapi/eventapi', async function(req, resp){
  var userId = req.query.id 
  var isCalendar = req.query.isCalendar 
  if (userId == null || isCalendar == null ){
    console.log("erreur in parametre") ; 
    var respBody = {"error":3,"events":null};
    resp.json(respBody);
    return ;
  }  
  let date = new Date();
  let dateString = stringDate(date)[0];
  console.log(userId)
  console.log(dateString)
  const db = makeDb(connection);
  var queryString = "" ;
  if (isCalendar == 0) {
    queryString = "SELECT  e.*  FROM EVENT e, Event_User eu where e.id = eu.fk_event_id AND eu.fk_user_id = '"+userId+"' " ;
  }
  else {
    queryString = "SELECT * FROM EVENT  where date >= '"+dateString+"' AND id NOT IN (Select fk_event_id from Event_User where fk_user_id = '"+userId+"' )";
  }

  try {
    const events = await db.query(queryString);
    if (events.length == 0) {
      var respBody = {"error":1,"events":null};
      resp.json(respBody);
    }
    else {

      for (var i in events){

          var isoDate = events[i].date ; 
          var newDate = new Date(isoDate);
          console.log("new date = "+ newDate);
          var dateTime = stringDate(newDate);
          console.log("dateTime = "+ dateTime);
          if (date > newDate){
            events[i].isOver = 1;
          }
          else {
            events[i].isOver = 0;
          }
          
          events[i].date = dateTime[0] ; 
          events[i].heurdepart = dateTime[1] ; 
          const countRow = await db.query("SELECT count(*) nbrInscrit FROM Event_User where fk_event_id = '"+events[i].id+"'");
          events[i].nbrInscrit = countRow[0].nbrInscrit ; 
      }

      console.log(events);
      var respBody = {"error":0,"events":events};
      resp.json(respBody);
    }
  } catch (err) {
    console.log(err);
    var respBody = {"error":2,"events":null};
    resp.json(respBody);}
    
  // } finally {
  //   await db.close();
  // }
  
  
})

function stringDate( newDate ) {
  var day = ("0" + newDate.getDate()).slice(-2);
  var month = ("0" + (newDate.getMonth() + 1)).slice(-2);
  var year = newDate.getFullYear();
  var hours = ("0" + newDate.getHours()).slice(-2); 
  var minutes = ("0" + newDate.getMinutes()).slice(-2);
  var seconds = ("0" + newDate.getSeconds()).slice(-2);
  var timeDepart = hours + ":" + minutes + ":" + seconds;
  var newDateString = year + "-" + month + "-" + day ;
  return [newDateString,timeDepart] ;

}







app.post('/pfeapi/insertuser', function(req, resp){
  var nom = req.body.nom
  var prenom = req.body.prenom
  var email = req.body.email
  var motdepasse = req.body.motdepasse
  var query = "INSERT INTO USER (nom,prenom,email,motdepasse) VALUES ('"+nom+"','"+prenom+"','"+email+"','"+motdepasse+"')";
  console.log(query);
  connection.query(query, function(error, rows, fields){
    if(!!error){ 
      if(error.code === 'ER_DUP_ENTRY'){
        console.log('email duplicated');
        var respBody = {"error":1};
        resp.json(respBody);
      }
      else {
        console.log('Error in the query'+error.message);
        var respBody = {"error":2};
        resp.json(respBody);
      }
      
    } else {
        console.log('Successful query');
        //parse with your rows/fields
        var respBody = {"error":0};
        resp.json(respBody);
    }
  });
})


app.post('/pfeapi/accesevent', function(req, resp){
  var userid = req.body.userid
  var eventid = req.body.eventid
  var etat = 0
  var query = "INSERT INTO Acces_User_Event (fk_event_id,fk_user_id,etat) VALUES ('"+eventid+"','"+userid+"','"+etat+"')";
  console.log(query);
  connection.query(query, function(error, rows, fields){
    if(!!error){ 
        console.log('Error in the query'+error.message);
        var respBody = {"error":1};
        resp.json(respBody);
      
    } else {
        console.log('Successful query');
        //parse with your rows/fields
        var respBody = {"error":0};
        resp.json(respBody);
    }
  });
})

app.post('/pfeapi/orgacceptaccesevent', function(req, resp){
  var userid = req.body.userid
  var eventid = req.body.eventid
  var dossard = 0
  var query = "INSERT INTO Event_User (fk_event_id,fk_user_id,dossard) VALUES ('"+eventid+"','"+userid+"','"+dossard+"')";
  console.log(query);
  connection.query(query, function(error, rows, fields){
    if(!!error){ 
        console.log('Error in the query'+error.message);
        var respBody = {"error":1};
        resp.json(respBody);
      
    } else {
        console.log('Successful query');
        //parse with your rows/fields
        var respBody = {"error":0};
        resp.json(respBody);
    }
  });
})

app.put('/pfeapi/orgrefuseaccesevent', function(req, resp){
  var id = req.body.id
  var etat = 1
  var query = "UPDATE Acces_User_Event set etat = '"+etat+"' where id = '"+id+"'";
  console.log(query);
  connection.query(query, function(error, rows, fields){
    if(!!error){ 
        console.log('Error in the query'+error.message);
        var respBody = {"error":1};
        resp.json(respBody);
      
    } else {
        console.log('Successful query');
        //parse with your rows/fields
        var respBody = {"error":0};
        resp.json(respBody);
    }
  });
})


app.put('/pfeapi/editprofile', async function(req, resp){
  var id = req.body.id
  var nom = req.body.nom
  var prenom = req.body.prenom
  var email = req.body.email
  var sexe = req.body.sexe
  var adresse = req.body.adresse
  var dateNaissance = req.body.dateNaissance
  var taille = req.body.taille
  var poids = req.body.poids
  if(id == null || nom == null || prenom == null || sexe == null || adresse == null || dateNaissance == null || taille == null || poids == null) {
    console.log("parametre is not valide");
    var respBody = {"error":2};
    resp.json(respBody);
    return ;
  }
  const db = makeDb(connection);

  var queryString = "UPDATE User set nom = '"+nom+"' , prenom = '"+prenom+"' , email = '"+email+"' , sexe = '"+sexe+"'  , adresse = '"+adresse+"' , dateNaissance = '"+dateNaissance+"' , taille = '"+taille+"' , poids = '"+poids+"'  where id = '"+id+"'";
  console.log(queryString);
  try {
    const events = await db.query(queryString);
    var respBody = {"error":0};
    resp.json(respBody);
  }catch(err) {
    var respBody = {"error":1};
    resp.json(respBody);
  }
})








app.listen(1338);


 
/*connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
connection.end();*/

