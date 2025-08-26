function loadData() {
    getUserData();
    getCityData();

}




async function getUserData() {
    const response = await fetch("http://localhost:8080/Zay1/MyAccount");

    if (response.ok) {
        const json = await response.json();
        console.log(json);
      
        // Load basic user info
        document.getElementById("firstName").value = json.firstName;
        document.getElementById("lastName").value = json.lastName;
        document.getElementById("currentPassword").value = json.password;

        if (json.hasOwnProperty("addressList") && json.addressList !== undefined && json.addressList.length > 0) {
            // Get the first address from the list
            const firstAddress = json.addressList[0];
            
            let email = firstAddress.user.email;
            let lineOne = firstAddress.lineOne;
            let lineTwo = firstAddress.lineTwo;
            let city = firstAddress.city.name;
            let postalCode = firstAddress.postalCode;
            let cityId = firstAddress.city.id;

            // Clear existing address list
            const addressUL = document.getElementById("addressUL");
            if (addressUL) {
                addressUL.innerHTML = ''; // Clear existing content
                
                // Add all addresses to the list
                json.addressList.forEach(address => {
                    const line = document.createElement("li");
                    line.innerHTML = address.lineOne + ",<br/>" +
                            address.lineTwo + ",<br/>" +
                            address.city.name + "<br/>" +
                            address.postalCode;
                    addressUL.appendChild(line);
                });
            }

            console.log("lineOne:", lineOne);
            console.log("lineTwo:", lineTwo);
            console.log("postalCode:", postalCode);
            console.log("cityId:", cityId);

            // Update address display elements
            if (document.getElementById("addName")) {
                document.getElementById("addName").innerHTML = `${json.firstName} ${json.lastName}`;
            }
            if (document.getElementById("addEmail")) {
                document.getElementById("addEmail").innerHTML = `Email: ${email}`;
            }
            if (document.getElementById("contact")) {
                // Use mobile from address if available, otherwise use default
                const mobile = firstAddress.mobile || "078956666";
                document.getElementById("contact").innerHTML = `Phone: ${mobile}`;
            }

            // Load first address into form fields
            document.getElementById("lineOne").value = lineOne;
            document.getElementById("lineTwo").value = lineTwo;
            document.getElementById("postalCode").value = postalCode;
            
            // Set city select after a small delay to ensure options are loaded
            setTimeout(() => {
                const citySelect = document.getElementById("citySelect");
                if (citySelect) {
                    citySelect.value = cityId;
                }
            }, 100);

        } else {
            // No addresses found, clear form fields
            document.getElementById("lineOne").value = "";
            document.getElementById("lineTwo").value = "";
            document.getElementById("postalCode").value = "";
            document.getElementById("citySelect").value = "0";
            
            // Update display elements with basic info
            if (document.getElementById("addName")) {
                document.getElementById("addName").innerHTML = `${json.firstName} ${json.lastName}`;
            }
            if (document.getElementById("addEmail")) {
                document.getElementById("addEmail").innerHTML = `Email: Not available`;
            }
            if (document.getElementById("contact")) {
                document.getElementById("contact").innerHTML = `Phone: Not available`;
            }
        }

    } else {
        console.error("Failed to load user data");
        document.getElementById("message").innerHTML = "Failed to load profile data";
    }
}





async function getCityData() {

    const response = await fetch("CityData");

    if (response.ok) {
        const json = await response.json();
        const citySelect = document.getElementById("citySelect");

        json.forEach(city => {
            let option = document.createElement("option");
            option.innerHTML = city.name;
            option.value = city.id;
            citySelect.appendChild(option);
        });



    }

}

async function saveChanges() {

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const lineOne = document.getElementById("lineOne").value;
    const lineTwo = document.getElementById("lineTwo").value;
    const postalCode = document.getElementById("postalCode").value;
    const  cityId = document.getElementById("citySelect").value;
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const userDataObject = {
        firstName: firstName,
        lastName: lastName,
        lineOne: lineOne,
        lineTwo: lineTwo,
        postalCode: postalCode,
        cityId: cityId,
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    };

    const userDataJson = JSON.stringify(userDataObject);


    const response = await fetch(
            "MyAccount", {
                method: "PUT",
                body: userDataJson,
                headers: {
                    "Content-Type": "application/json"
                }

            }
    );

    if (response.ok) {

        const json = await response.json();
        if (json.status) {

            getUserData();

        } else {

            document.getElementById("message").innerHTML = json.message;

        }

    } else {
        document.getElementById("message").innerHTML = "Profile Details update failed";
    }



}