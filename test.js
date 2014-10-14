var domain = ""; // Domain - Real or Play
var lobbyTypeGlobal; // Type of the Lobby Eg. Main, Cash, SNG etc


/*
 * Global varibales are defined here to make the javaScriipt in sync with LobbyConfigUtilsTool
 * The variable if there is any change in LobbyConfigToolUtils
 */

//LobbyType
var mainLobbyType = 0;
var cashPlayLobby = 1;
var ffPlayLobby = 2;
var sngPlayLobby = 3;
var mttPlayLobby = 4;
//accountStatus
var naAccount=-1;
var play=0;
var real=1;
var pseudo=2;
//userType
var naUserType = -1;
var firstTime = 0;
var returnUser = 1;
var preLoginUserType = 2;
//gameGroup
var cashGame = 0;
var ff = 1;
var sng = 2;
var mtt = 4;
//cardType
var naCardType=-1;
var mission=1;
//TableType
var naTableType = -1;
var oneTable=1;
var multiTable=2;
var gng=3;
var qualifiers=4;
//LoginStatus
var preLogin=0;
var postLogin=1;
//SpeedType
var regular=0;
var speed=1;
var any=2;
var turbo=3;
var superSpeed=4;
var hyperTurbo=5;
/*
 * End in global variables
 * javaScript functions
 */

function verifyLobbyPreviewFieldsAndGetCardDetails(){
    var url = "/pokergameadmin/lobbyConfig/verifyAndSearchCardsDetails.action";
    var divID = "configureCardsDiv";
    var frmName = "CreateLobbyTemplateForm";
    lobbyTypeGlobal = $("#lobbyType option:selected").val();
    var validFlag = validateLobbyFields();
    if(!validFlag){ //don't submit if validation fails
        return false;
    }

    commonSpinnerImage(divID);
    var formData = jQuery("#"+frmName).serialize();
    url=url+'?'+formData;
    pg.loadServerTable(divID, url);
    getfocus('ui-layout-center', divID);
}

/*
 * Validation of fields to come here :)
 */
function validateLobbyFields(){
    if( $("#CreateLobbyTemplateForm input[name=frontends]:checked").val() == null){
        alert("Please enter a frontEnd");
        return false;
    }else if($("#CreateLobbyTemplateForm input[name=channelTypes]:checked").val() == null){
        alert("Please choose at least one channel");
        return false;
    }
    return true;
}

function enableHiddenFrontEnd(frontEndClassId){
    disableOtherLiquidities(frontEndClassId);
    var hiddenFrontEndsClasses = $('.'+frontEndClassId).get();
    for ( var int = 0; int < hiddenFrontEndsClasses.length; int++) {
        if(hiddenFrontEndsClasses[int].disabled == true){
            hiddenFrontEndsClasses[int].disabled = false;
        }else if(hiddenFrontEndsClasses[int].disabled == false){
            hiddenFrontEndsClasses[int].disabled = true;
        }
    }
}

function disableOtherLiquidities(frontEndClassId){
    var groupid = (frontEndClassId.split("_"))[0];
    var formId = "CreateLobbyTemplateForm";
    var formObj = document.getElementById(formId);
    var formElements = formObj.elements["frontEnds"];
    var formElemArray = new Array();
    if( formElements.length != undefined){
        for(var g = 0 ;g < formElements.length;g++){
            formElemArray[formElemArray.length] = formElements[g];
        }
    }else{
        formElemArray[formElemArray.length] = formElements;
    }

    for(var i=0;i<formElemArray.length;i++){
        var frontEndId=formElemArray[i].id;
        if((frontEndId.split("_"))[0]==groupid){
        }else{
            if (document.getElementById(frontEndId).disabled == false) {
                document.getElementById(frontEndId).disabled = true;
            }
        }
    }
}

function disableHiddenFrontEnd(frontEndId){
    if(document.getElementById(frontEndId).disabled == true){
        document.getElementById(frontEndId).disabled = false;
    }else if (document.getElementById(frontEndId).disabled == false) {
        document.getElementById(frontEndId).disabled = true;
    }
}

function showCardDetails(lobbyTemplateDetails){
    var url = "/pokergameadmin/lobbyConfig/getCardDetailsForUpdate.action";
    var divID = "configureCardPostionVsGameType";
    url = url + '?' + "lobbyTemplateDetails=" + lobbyTemplateDetails;
    pg.loadServerTable(divID, url);
    getfocus('ui-layout-center', divID);

}

function verifyLobbyManagerFieldsAndGetCardDetailsForm(){
    var url = "/pokergameadmin/lobbyConfig/getCardDetailsForm.action";
    var divID = "configureCardsDiv";
    var frmName = "CreateLobbyTemplateForm";
    lobbyTypeGlobal = $("#lobbyType option:selected").val();

    var validFlag = validateLobbyFields();
    if(!validFlag){ //donot submit if validation fails
        return false;
    }

    commonSpinnerImage(divID);
    var formData = jQuery("#"+frmName).serialize();
    url=url+'?'+formData;
    pg.loadServerTable(divID, url);
    getfocus('ui-layout-center', divID);
}

/*
 * For lobbyManager cardsConfiguration static
 */
function validateUpdateStaticCardTemplate(isConfigurationExists){

    var url = "/pokergameadmin/lobbyConfig/setStaticCardDetails.action";
    var divID = "msgStaticDiv";
    var frmName = "CardsAttributesConfigurationForm";
    var validFlag = validateStaticCardFields(isConfigurationExists);
    if(!validFlag){ //don't submit if validation fails
        return false;
    }
    commonSpinnerImage(divID);
    var formData = jQuery("#"+frmName).serialize();
    url=url+'?'+formData;
    pg.loadServerTable(divID, url);
    getfocus('ui-layout-center', divID);
}

function validateStaticCardFields(isConfigurationExists){
    if(areValidCustomStakes()){
        if(isConfigurationExists == 1){
            if (confirm('This will override the existing template. Are you sure you want to proceed?')) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }else{
        return false;
    }
}

function areValidCustomStakes(){
    var regExp =  /^[0-9]*(\.[0-9]{1,2})?$/;
    for ( var int = 1; int < 11; int++) {
        var customStake = document.getElementById(int+"_stakes_custom");
        if(customStake!=null){
            if(!(customStake.style.display=='none')){
                stakeVal = customStake.value;
                if(!(regExp.test(stakeVal) && stakeVal!='')){
                    alert("please input a valid stake");
                    customStake.value = '';
                    return false;
                }
            }
        }
    }
    return true;
}

/*
 * For lobbyManager cardsConfiguration dynamic
 */
function validateUpdateDynamicCardTemplate(isConfigurationExists){
    var url = "/pokergameadmin/lobbyConfig/setDynamicCardDetails.action";
    var frmName = "CardsConfigurationForm";
    var divID = "msgDynamicDiv";
    var validFlag = validateDynamicCardFields(isConfigurationExists);
    if(!validFlag){ //don't submit if validation fails
        return false;
    }

    commonSpinnerImage(divID);
    var formData = jQuery("#"+frmName).serialize();
    url=url+'?'+formData;
    pg.loadServerTable(divID, url);
    getfocus('ui-layout-center', divID);
}

function validateDynamicCardFields(isConfigurationExists){
    if(isConfigurationExists == '1'){
        if (confirm('This will override the existing template. Are you sure you want to proceed?')) {
            return true;
        } else {
            return false;
        }
    }
    return true;
}
// For dynamically changing the cards

function deleteACard(tableID){

    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;
    if(rowCount > 2){
        table.deleteRow(rowCount - 1);
    }else{
        alert("cannot have less than " + (rowCount - 1) + " card/cards");
        return false;
    }
}


// function addOneCard(divName){
//	 var table = document.getElementById(divName);
////	 Row count is number of cards + one count for heading in the table
//	 var rowCount = table.rows.length;
//	 if(rowCount > 10){
//		 alert("Already reached maximum number of cards = " + (rowCount - 1));
//		 return(false);
//	 }else{
//
//		 var row = table.insertRow(rowCount);
//		 var cell1 = row.insertCell(0);
//		 var row = table.insertRow(rowCount);
//
//		 var cell1 = row.insertCell(0);
//		 var element1=document.createElement("span");
//		 element1.className='inputClass';
//		 element1.innerHTML = rowCount;
//		 cell1.appendChild(element1);
//
//		 var element11 = document.createElement("input");
//		 element11.name = 'position';
//		 element11.value = rowCount;
//		 element11.type = 'hidden';
//		 cell1.appendChild(element11);
//
//
//		 cell1.appendChild(element1);
//		 var cell2 = row.insertCell(1);
//		 var element2=document.createElement("select");
//		 element2.name='gameGroup';
//		 element2.className='inputClass';
//		 var options = document.getElementById(1 + '_gameGroup').options;
//
//		 for(var i = 0; i < options.length; i++){
//
//			   var opt = document.createElement("option");
//			   opt.text = options[i].text;
//			   opt.value = options[i].value;
//			   element2.options.add(opt);
//
//		 }
//
//		 cell2.appendChild(element2);
//
//
//		 var cell3 = row.insertCell(2);
//		 var element3=document.createElement("select");
//		 element3.name='cardType';
//		 element3.className='inputClass';
//
//		 var options = document.getElementById(1 + '_cardType').options;
//
//		 for(var i = 0; i < options.length; i++){
//
//			   var opt = document.createElement("option");
//			   opt.text = options[i].text;
//			   opt.value = options[i].value;
//			   element3.options.add(opt);
//
//		 }
//		 cell3.appendChild(element3);
//	 }
// }


//	function addOneStaticCard(divName){
//		 var table = document.getElementById(divName);
////		 Row count is number of cards + one count for heading in the table
//		 var rowCount = table.rows.length;
//		 if(rowCount > 10){
//			 alert("Already reached maximum number of cards = " + (rowCount - 1));
//			 return(false);
//		 }else{
//
//			 var row = table.insertRow(rowCount);
//			 var cell1 = row.insertCell(0);
//			 var element1=document.createElement("span");
//			 element1.className='inputClass';
//			 element1.innerHTML = rowCount;
//			 cell1.appendChild(element1);
//
//			 var element11 = document.createElement("input");
//			 element11.name = 'position';
//			 element11.value = rowCount;
//			 element11.type = 'hidden';
//			 cell1.appendChild(element11);
//
//
//
//			 var cell2 = row.insertCell(1);
//			 var element2=document.createElement("select");
//			 element2.name='gameGroup';
//			 element2.className='inputClass';
//			 element2.id = rowCount + '_gameGroup';
//			 var options = document.getElementById(1 + '_gameGroup').options;
//			 for(var i = 0; i < options.length; i++){
//				   var opt = document.createElement("option");
//				   opt.text = options[i].text;
//				   opt.value = options[i].value;
//				   element2.options.add(opt);
//			 }
//			 element2.onchange = function(){onGameGroupChange(rowCount)};
//			 cell2.appendChild(element2);
//
//
//			 var cell3 = row.insertCell(2);
//			 var element3=document.createElement("select");
//			 element3.name='gameType';
//			 element3.className='inputClass';
//			 element3.id=rowCount + "_gameType";
//			 var options = document.getElementById(1 + '_gameType').options;
//			 for(var i = 0; i < options.length; i++){
//				   var opt = document.createElement("option");
//				   opt.text = options[i].text;
//				   opt.value = options[i].value;
//				   element3.options.add(opt);
//			 }
//			 cell3.appendChild(element3);
//
//
//			 var cell4 = row.insertCell(3);
//			 var element4=document.createElement("select");
//			 element4.name='limitType';
//			 element4.className='inputClass';
//			 element4.id=rowCount + '_limitType'
//			 var options = document.getElementById(1 + '_limitType').options;
//			 for(var i = 0; i < options.length; i++){
//				   var opt = document.createElement("option");
//				   opt.text = options[i].text;
//				   opt.value = options[i].value;
//				   element4.options.add(opt);
//			 }
//			 cell4.appendChild(element4);
//
//			 var cell5 = row.insertCell(4);
//			 var element5=document.createElement("select");
//			 element5.name='stakes';
//			 element5.className='inputClass';
//			 element5.id=rowCount + '_stakes';
//			 var options = document.getElementById(1 + '_stakes').options;
//			 for(var i = 0; i < options.length; i++){
//				   var opt = document.createElement("option");
//				   opt.text = options[i].text;
//				   opt.value = options[i].value;
//				   element5.options.add(opt);
//			 }
//			 cell5.appendChild(element5);
//
//			 var gameGroup = $("#1_gameGroup option:selected").val();
//			 var cell6 = row.insertCell(5);
//			 var element6=document.createElement("select");
//			 element6.name='tableType';
//			 element6.className='inputClass';
//			 element6.id = rowCount + '_tableType';
//			 var options = document.getElementById(1 + '_tableType').options;
//			 for(var i = 0; i < options.length; i++){
//				   var opt = document.createElement("option");
//				   opt.text = options[i].text;
//				   opt.value = options[i].value;
//				   element6.options.add(opt);
//			 }
//			 element6.onchange = function(){onTableTypeChange(rowCount)};
//			 if(gameGroup != 2){
//				 element6.disabled='disabled';
//			 }
//			 cell6.appendChild(element6);
//
//			 var element61 = document.createElement("input");
//			 element61.name = 'tableType';
//			 element61.value = -1;
//			 element61.type = 'hidden';
//			 element61.id = rowCount + '_tableType';
//			 if(gameGroup == 2){
//				 element61.disabled='disabled';
//			 }
//			 cell6.appendChild(element61);
//
//			 var gameGroup = $("#1_numberOfSeats option:selected").val();
//			 var cell7 = row.insertCell(6);
//			 var element7=document.createElement("select");
//			 element7.name='numberOfSeats';
//			 element7.className='inputClass';
//			 element7.id = rowCount + '_numberOfSeats';
//			 var options = document.getElementById(1 + '_numberOfSeats').options;
//			 for(var i = 0; i < options.length; i++){
//				   var opt = document.createElement("option");
//				   opt.text = options[i].text;
//				   opt.value = options[i].value;
//				   element7.options.add(opt);
//			 }
//			 element7.onchange = function(){onSeatsChange(rowCount)};
//			 cell7.appendChild(element7);
//	}
//
// }


//	Constraint in the forms are applied by these functions
//	For the integer to String value map check "com.partypoker.lobby.utils.LobbyConfigToolUtils"
//	   loginStatus - PreLogin
//	   |-----AccountStatus-	NA
//	 		 |---UserType - PreLogin
//	   loginStatus - PostLogin
//	   |------AccountStatus-	Real
//	 		  |-----UserType - FirstTime, Return
//	   |------AccountStatus - Play, Pseudo
//			  |------UserType - NA

function onChangeAccountStatus(){
    var userType = $("#userType option:selected").val();
    var accountStatus = $("#accountStatus option:selected").val();
    if (accountStatus == real) {//Real
        $("#userType").val(firstTime); //FirsTime
        $("#userType").show();
        $("#userTypeLabel").show();

    }else if(accountStatus==play || accountStatus==pseudo){//Play or Pseudo
        $("#userType").val(naUserType);//NA
        $("#userType").hide();
        $("#userTypeLabel").hide();
    }
}

function onChangeLoginStatus(){
    var loginStatus = $("#loginStatus option:selected").val();


    if(loginStatus==preLogin){// PreLogin

        $("#userType").val(preLoginUserType);// Prelogin
        $("#userType").hide();
        $("#userTypeLabel").hide();

        $("#accountStatus").val(naAccount);//NA
        $("#accountStatus").hide();
        $("#lobbyAccountStatusLabel").hide();

    }else if(loginStatus==postLogin){// PostLogin

        $("#accountStatus").val(real);//Real
        $("#accountStatus").show();
        $("#lobbyAccountStatusLabel").show();

        $("#userType").val(firstTime);//FirstTime
        $("#userType").show();
        $("#userTypeLabel").show();
    }
}

function onGameGroupChange(position){
    var gameGroupId = position + "_gameGroup";
    var tableTypeId = position + "_tableType";
    var tableTypeNAId = position + "_tableTypeNA";

    var gameGroup = $("#" + gameGroupId + " option:selected").val();
    var tableType = $("#" + tableTypeId + " option:selected").val();
    setFieldsForGameGroup(gameGroup, position);
    setTableType(gameGroup, tableTypeId, tableTypeNAId);
}

function setFieldsForGameGroup(gameGroup, position){
    if(gameGroup != mtt){
        $("#" + position + "_stakes_custom").removeAttr("disabled");
        $("#" + position + "_tableType").removeAttr("disabled");
        $("#" + position + "_gameType").removeAttr("disabled");
        $("#" + position + "_limitType").removeAttr("disabled");
        $("#" + position + "_stakes").removeAttr("disabled");
        $("#" + position + "_numberOfSeats").removeAttr("disabled");
        $("#" + position + "_speedType").removeAttr("disabled");

    }else{
        $("#" + position + "_stakes_custom").attr("disabled","disabled");
        $("#" + position + "_tableType").attr("disabled","disabled");
        $("#" + position + "_gameType").attr("disabled","disabled");
        $("#" + position + "_limitType").attr("disabled","disabled");
        $("#" + position + "_stakes").attr("disabled","disabled");
        $("#" + position + "_numberOfSeats").attr("disabled","disabled");
        $("#" + position + "_speedType").attr("disabled","disabled");
    }
}

function setTableType(gameGroup, tableTypeId, tableTypeNAId){
    if(gameGroup != sng){
        $("#" + tableTypeId).val(naTableType);
        $("#" + tableTypeId).attr('disabled','disabled');
        $("#" + tableTypeNAId).removeAttr("disabled");
    }else{
        $("#" + tableTypeNAId).attr("disabled","disabled");
        $("#" + tableTypeId).removeAttr("disabled");
        $("#" + tableTypeId).val(naTableType);
    }
}



function onTableTypeChange(position){
    var gameGroupId = position + "_gameGroup";
    var tableTypeId = position + "_tableType";

    var gameGroup = $("#" + gameGroupId + " option:selected").val();

    if(gameGroup != sng){
        alert("Table type valid only for SNG");
        $("#" + tableTypeId).val(naTableType);
        $("#" + tableTypeId).attr("disabled", "disabled");
    }
}

function onChangeLobbyType(){
    var lobbyType = $("#lobbyType option:selected").val();
    if(lobbyType == 5){//Play Money Lobby Type
        $("#playLobbyGameType").show();
        $("#forGames").show();
    }else{
        $("#playLobbyGameType").hide();
        $("#forGames").hide();
    }
}

function onStakesChange(position){
    var stakes = $("#" + position + "_stakes");
    if(stakes.val() < 0){
        var customStakes = document.getElementById(position + "_stakes_custom");
        customStakes.disabled = false;
        customStakes.style.display="block";
    }else{
//		var customStakes = $("#" + position + "_stakes_custom");
        var customStakes = document.getElementById(position + "_stakes_custom");
        customStakes.disabled = true;
        customStakes.style.display="none";
    }
}

function onSeatsChange(position){
    //TODO: Tob be added here some constraints
}

// on load document methods

function onLoadOfLobbyManagerTemplate(){
    $("#accountStatus option[value="+naAccount+"]").hide();
    $("#userType option[value="+naUserType+"]").hide();
    $("#userType option[value="+preLoginUserType+"]").hide();
    //Play Money Lobby Type Specific
    //$("#playLobbyGameType").hide();
    //$("#forGames").hide();
}

function enableNATableType(cardNumber){
    var tableTypeId;
    var tableTypeNAId;
    for(var i = 1; i <= cardNumber; i++){
        tableTypeId = i + "_tableType";
        tableTypeNAId = i + "_tableTypeNA";
        $("#" + tableTypeId).attr("disabled","disabled");
        $("#" + tableTypeNAId).removeAttr("disabled");
    }
}

function disableNATableType(cardNumber){
    var tableTypeId;
    var tableTypeNAId;
    for(var i = 1; i <= cardNumber; i++){
        tableTypeId = i + "_tableType";
        tableTypeNAId = i + "_tableTypeNA";
        $("#" + tableTypeNAId).attr("disabled","disabled");
        $("#" + tableTypeId).removeAttr("disabled");
    }
}

function onConfigureCardsAttributesFormLoad(cardNumber, action){
    if(action = 'UPDATAE'){
        setTableTypeFromGameGroup(cardNumber);
    }else{
        if(lobbyTypeGlobal != 2){
            enableNATableType(cardNumber);
        }else{
            disableNATableType(cardNumber);
        }
    }
}


function onConfigureCardsFormLoad(cardNumber, action){
    onConfigureCardsAttributesFormLoad(cardNumber, action);
}

function setTableTypeFromGameGroup(cardNumber){
    for ( var i = 1; i <= cardNumber; i++) {
        var gameGroupId = i + "_gameGroup";
        var tableTypeId = i + "_tableType";

        var gameGroupValue = $("#" + gameGroupId + " option:selected").val();
        var tableTypeValue = $("#" + tableTypeId + " option:selected").val();
        setFieldsForGameGroup(gameGroupValue, i);
        if(gameGroupValue != sng){
            enableNATableTypeForACard(i);
        }else{
            disableNATableTypeForACard(i);
        }
    }
}

function enableNATableTypeForACard(position){
    var tableTypeId;
    var tableTypeNAId;
    tableTypeId = position + "_tableType";
    tableTypeNAId = position + "_tableTypeNA";
    $("#" + tableTypeId).attr("disabled","disabled");
    $("#" + tableTypeNAId).removeAttr("disabled");
}

function disableNATableTypeForACard(position){
    var tableTypeId;
    var tableTypeNAId;
    tableTypeId = position + "_tableType";
    tableTypeNAId = position + "_tableTypeNA";
    $("#" + tableTypeNAId).attr("disabled","disabled");
    $("#" + tableTypeId).removeAttr("disabled");

}

function onLoobyPreviewTemplateLoad(){
    $("#accountStatus option[value="+naAccount+"]").hide();
    $("#userType option[value="+naUserType+"]").hide();
    $("#userType option[value="+preLoginUserType+"]").hide();
}

function reloadLobbyOption(reloadId){
    var divID="reloadMessage";
    commonSpinnerImage(divID);
    jQuery.ajax( {
        type : "POST",
        url : "/pokergameadmin/lobbyConfig/reloadLobbyOptions.action?reloadId=" + reloadId,
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function(html){
            $('#'+divID).html(html);
        }
    });
}

function onChangeCardPref(cardId){
    var card = $('#card' + cardId);
    var selection = card.val();
    var header = $('.customHeaders');
    if(selection == 3){
        card.parent().find('.customOptions').show();
        card.parent().find('.customTemplate').hide();
        header.show();
    }else if (selection == 2){
        card.parent().find('.customTemplate').show();
        card.parent().find('.customOptions').hide();
        header.hide();

    } else{
        card.parent().find('.customOptions').hide();
        var cards = $("select[name='cardPrefs']");
        for(card in cards){
            if($(card).val() == 2)
                return;
        }
        header.hide();
    }
}

function verifyAndSendTemplateDetails(){
    if(isCreateTopCardsTemplateValid()){
        var divID="statusMessage";
        var url = "/pokergameadmin/lobbyConfig/saveSNGTopCardsTemplate.action";
        var frmName = "CreateSNGTopCardsPrefsForm";
        lobbyTypeGlobal = $("#lobbyType option:selected").val();

        var formData = jQuery("#"+frmName).serialize();
        commonSpinnerImage(divID);
        url=url;
        jQuery.ajax( {
            type : "POST",
            url : url,
            data: formData,
            contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function(html){
                $('#'+divID).html(html);
                $('#submitSNGLobbyManagerFields').hide();
                $('#createNewTemplate').show();
            }
        });
    }
    else{
        $('#statusMessage').html( "<strong style='çolor: red'>Invalid input in Text Box</strong>" );
    }
}

function isCreateTopCardsTemplateValid(){
    var buyIns = $('input.customOptions');
    for(var i=0;i < 8;i++){
        var buyIn = $(buyIns[i]);
        if(buyIn.css('display') != 'none'){
            if(!(buyIn.val().length != 0 && !isNaN(buyIn.val()) && buyIn.val() >= 0)){
                return false;
            }
        }
    }
    var sngTemplateIds = $('input.customTemplate');
    for(var i=0;i < 8;i++){
        var sngTemplateId = $(sngTemplateIds[i]);
        if(sngTemplateId.css('display') != 'none'){
            if(!(sngTemplateId.val().length != 0 && !isNaN(sngTemplateId.val()) && sngTemplateId.val() > 0)){
                return false;
            }
        }
    }
    var templateName = $('input#templateName');
    if(templateName.val().length == 0){
        return false;
    }
    return true;
}


function verifyAndUploadPlayerList(){
    if(validatePlayerList()){
        var divID="statusMessage";
        var url = "/pokergameadmin/lobbyConfig/saveUploadPlayersForSpecificTemplate.action";
        var frmName = "UploadPlayersToTopCardsPrefsForm";
        lobbyTypeGlobal = $("#lobbyType option:selected").val();
        var formData = $("#"+frmName).serialize();
        commonSpinnerImage(divID);
        url=url;
        jQuery.ajax( {
            type : "POST",
            url : url,
            data: formData,
            contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function(html){
                $('#'+divID).html(html);
            }
        });
    }
}



function validatePlayerList(){
    var accNamesList = document.forms["UploadPlayersToTopCardsPrefsForm"]["players"].value;
    if (accNamesList==null || accNamesList.trim()=="")
    {
        alert("Please enter atleast one account name");
        return false;
    }
    if(accNamesList.split(/[\s,;]+/).length > 1500){
        alert("Too many entries. Please enter not more than 1500 Player Account Names.");
        return false;
    }
    return true;
}

function createNewSNGTemplate(){
    pg.tree.addSelectedClass('Poker','textBoldLHN','rlobby_configuration_tooltop_8_cardscreate_sng_top_8_cards_template');
    handleUrls('rlobby_configuration_tooltop_8_cardscreate_sng_top_8_cards_template','Create SNG Top 8 Cards Template','/pokergameadmin/lobbyConfig/createSNGTopCardsTemplate.action');
}