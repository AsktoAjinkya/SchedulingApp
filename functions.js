const schedule = require('node-schedule');
const db = require('electron-db');
const path = require('path')



var MyDiv = document.getElementById("div1");
var MyTime = document.getElementById("appt");
var MyLink = document.getElementById("mylink");
var MySubject = document.getElementById("subname");
var Deletevalue = document.getElementById("delname");


var myvalues = [];
var myjobs = [];



const myloc = path.join(__dirname, '')

db.createTable('schedules', myloc, (succ, msg) => {
    // succ - boolean, tells if the call is successful
    console.log("Success: " + succ);
    console.log("Message: " + msg);
  })




function Myfunc(getval)
{
        var NowTime = myvalues[getval].times+" * * *";

        console.log(NowTime);

        const job = schedule.scheduleJob(NowTime, function(){

            const greeting = new Notification( myvalues[getval].subject,{
                body: myvalues[getval].link,
            });
            
            
            greeting.addEventListener('click', function(){
                window.open(myvalues[getval].link);
            });
            
        });
        myjobs.push(job);

}


function displaynode(VarObj)
{
    var timehere = VarObj.times[3]+VarObj.times[4]+":"+VarObj.times[0]+VarObj.times[1];

    var MyText = document.createTextNode("Sub: "+VarObj.subject+" / Time: "+timehere+" / Link: "+VarObj.link);

    var MyNode = document.createElement("li");

    MyNode.appendChild(MyText);
    MyDiv.appendChild(MyNode);

}

document.getElementById("button1").addEventListener('click',function(){
    

    if(MySubject.value.length == 0 || MyTime.value.length == 0 || MyLink.value.length == 0)
    {
        alert("Enter proper data.");
        return;
    }

    let obj = new Object();

    obj.times = MyTime.value[3]+MyTime.value[4]+" "+MyTime.value[0]+MyTime.value[1];
    obj.link = MyLink.value;
    obj.subject = MySubject.value;

    myvalues.push(obj);

    if (db.valid('schedules',myloc)) {
        db.insertTableContent('schedules', myloc, obj, (succ, msg) => {
          // succ - boolean, tells if the call is successful
          console.log("Success: " + succ);
          console.log("Message: " + msg);
        })
      }
    
    Myfunc(myvalues.length-1); displaynode(obj);

    
});


function displayall()
{
    MyDiv.innerHTML = '';
    db.getAll('schedules', myloc, (succ, data) => {
        // succ - boolean, tells if the call is successful
        // data - array of objects that represents the rows.
        for(var itr=0; itr<data.length; itr++)
        {
            displaynode(data[itr]);
            //Myfunc(itr);
            myvalues.push(data[itr]);
    
        }
        for(var itr=0; itr<data.length; itr++)
        {
            Myfunc(itr);
        }
    
      });
}

displayall();



document.getElementById("button2").addEventListener('click',function(){
    console.log("Clicked");

    if(Deletevalue.value.length == 0)
    {
        alert("Enter proper value.");
        return;
    }

    db.search('schedules', myloc, 'subject', Deletevalue.value, (succ, data) => {
        if (succ) {
            console.log(data[0].subject);

            db.deleteRow('schedules', myloc, {'subject': data[0].subject}, (succ, msg) => {
                console.log(msg);
                
              });

            displayall();

        }
        else
        {
            alert("No data found");
        }
      });
})




  








