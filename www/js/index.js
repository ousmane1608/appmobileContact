

const contactList =[];
document.addEventListener ( "deviceready", onDeviceReady, false) ;
function onDeviceReady() { 
    // Vérifie si l'API des contacts est disponible
    if (navigator.contacts) {

        try
        {
            var options = new ContactFindOptions();

        }catch (e){ alert(e)}
        
        options.filter = "";
        options.multiple = true;
        var fields = ["name"];  
        try{
            navigator.contacts.find(fields, onSuccess, onError, options);
        }catch(e){
            alert(e)
        }
    } 
    else 
    {
    alert("API des contacts non disponible sur cet appareil.");
    console.log("API des contacts non disponible sur cet appareil.");
    }
}

function onSuccess(contacts) {

    const ul = $('#contactList');

    for (let index = 0; index < contacts.length; index++) {

        const contact =contacts[index]
        const id = contact.id
        contactList.push(contact)
        var li = `
                    <li id=${id} style="margin-top:20px; text-decoration: none; color: black;">
                        <div style="display: flex; align-items: center;">
                            <img src="img/logo.png" style="width: 50px; height: 50px; margin-right: 20px">
                            <div style="display: flex; flex-direction: column; width:99%;">
                                <a href="#detailsPage" style="color:black" onClick="displayDetails(${id})">
                                    <p style="color:black">${contact.name.formatted}</p>
                                </a>
                            </div>
                            <button style=" color: black; border: none; padding: 5px 10px; border-radius: 5px;  margin-right: 0%;" onClick="deleteContact(${id})" >x</button>
                        </div>
                    </li>`;  ul.append(li);

    }
 }

 
 function onError(error) {
    alert("Erreur lors de la recherche des contacts : " + error.code);
    console.log("Erreur lors de la recherche des contacts :", error);
}

function deleteContact(idContact) {
    const contact = contactList.find(contact => contact.id == idContact);
    contact.remove(successDelet, errorDelet);
    function successDelet() {
        // supprimer le contact de la liste
        contactList.splice(contactList.findIndex(contact => contact.id == idContact), 1);
        // supprimer le contact de la liste affichée
        $(`li#${idContact}`).remove();
    }

    function errorDelet() {
        alert("Erreur lors de la suppression du contact");
    }
    
}

function editContact(event) {
    event.preventDefault();
    const id = $('#detailsPage').find('li:nth-child(1) ').attr('id');
    // modifier le contact dont l'id est id
    const contact = contactList.find(contact => contact.id == id);
    contact.name.familyName = $('#Mnom').val();
    contact.name.givenName = $('#Mprenom').val();
    contact.phoneNumbers[0].value = $('#Mtelephone').val();
    contact.emails[0].value = $('#Memail-1').val();
    contact.name.formatted = $('#Mprenom').val()+ " " +$('#Mnom').val();
    contact.save(successEdit, errorEdit);
    function successEdit(newContact) {
        // alert("Contact modifié avec succès: "+id);

        const index = contactList.findIndex(contact => contact.id == id);
        contactList[index] = newContact;
        // modifier le contact dans la liste affichée
        $(`li#${id}`).find('a').find('p').text(contact.name.formatted);
        // modifier dans delailsPage
        $('#detailsPage').find('li:nth-child(1) ').text(contact.name.formatted);
        // successEdit
        $.mobile.changePage("#detailsPage", { transition: "slide", changeHash: false });
    }
    function errorEdit() {
        alert("Erreur lors de la modification du contact");
    }

}
function displayDetails(id){

    const contact = contactList.find(contact => contact.id == id);
    // $('#detailsPage').find('li:nth-child(1) ')
    //  add attribute to the li element
    $('#detailsPage').find('li:nth-child(1) ').attr('id', contact.id);
    $('#detailsPage').find('li:nth-child(1) ').text(contact.name.formatted);
    $('#detailsPage').find('li:nth-child(2) a').html((contact.phoneNumbers[0].value!="" ? contact.phoneNumbers[0].value : ' '));
    $('#detailsPage').find('li:nth-child(3) a').text((contact.emails && contact.emails[0].value !== "" ? contact.emails[0].value : ' Pas de mail'));

    // formulaire de modification: donner les valeurs par défaut
    $('#Mnom').val(contact.name.familyName);
    $('#Mprenom').val(contact.name.givenName);
    $('#Mtelephone').val(contact.phoneNumbers[0].value);
    $('#Memail-1').val(contact.emails[0].value);
    

}

const addContact = () => {
    // event.preventDefault();
    // console.log("hello world")
    if ($('#nom').val() && $('#prenom').val() && $('#telephone').val() ){
        const contact = navigator.contacts.create();
        contact.displayName = $('#nom').val();
        contact.nickname = $('#prenom').val();
        contact.name = new ContactName();
        contact.name.formatted = $('#prenom').val() +" "+$('#nom').val();
        contact.name.givenName = $('#prenom').val();
        contact.name.familyName = $('#nom').val();
        contact.phoneNumbers = [new ContactField('mobile', $('#telephone').val(), true)];
        // contact.emails = [new ContactField('work', $('#email').val(), true)];
        contact.save(onSuccess2, onError);
    }
    else{
        // retourner a la page homePage
        $.mobile.changePage("#homePage", { transition: "slide", changeHash: false });
        
    }
   
}
function onSuccess2(contact) {
        // modifier le ul de la page homePage uniquement
        const ul = $('ul#contactList');

        var li = `
            <li id=${contact.id} style="margin-top:20px; text-decoration: none; color: black;">
                <div style="display: flex; align-items: center;">
                <img src="img/logo.png" style="width: 50px; height: 50px; margin-right: 20px">
                <div style="display: flex; flex-direction: column;width:99%;">
                    <a href="#detailsPage" style="color:black" onClick="displayDetails(${contact.id})">
                        <p style="color:black">${contact.name.formatted}</p>
                    </a>
                </div>
                <button style=" color: black; border: none; padding: 5px 10px; border-radius: 5px;  margin-right:0%;"  onClick="deleteContact(${contact.id})" >x</button>
                </div>
            </li>`;  ul.append(li);

        for (let index = 0; index < contactList.length; index++) {
            const contact = contactList[index];
            const li = `
                <li id=${contact.id} style="margin-top:20px; text-decoration: none; color: black;">
                    <div style="display: flex; align-items: center;">
                        <img src="img/logo.png" style="width: 50px; height: 50px; margin-right: 20px">
                        <div style="display: flex; flex-direction: column;width:99%;">
                            <a href="#detailsPage" style="color:black" onClick="displayDetails(${contact.id})">  
                                <p style="color:black">${contact.name.formatted}</p>
                            </a>
                        </div>
                        <button style=" color: black; border: none; padding: 5px 10px; border-radius: 5px;  margin-right:0%;" onClick="deleteContact(${contact.id})" >x</button>
                    </div>
                </li>`;  ul.append(li);

        }
        // rafresh la liste des contacts
        ul.listview('refresh');
        
        
    }