import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users$: BehaviorSubject<any> = new BehaviorSubject([
    {
      "_id": "buyer-demo",
      "createdAt": {
        "$date": "2019-04-12T15:02:01.364Z"
      },
      "password": 'demo.buyer',
      "emails": [
        {
          "address": "demo.buyer@gmail.com",
          "verified": true
        }
      ],
      "info": {
        "firstName": "Buyer",
        "lastName": "Dealogikal",
        "birthDate": "04/12/2000",
        "gender": "male",
        "address": {
          "country": "PH",
          "address1": "Block 1 Lot 30 South Hills Subdivision",
          "address2": "Brgy. Pacita 2",
          "address3": "San Pedro",
          "address4": "Laguna",
          "postalCode": "4023"
        },
        "landlineNo": {
          "countryCode": "63",
          "number": "1231321231"
        },
        "faxNo": {
          "countryCode": "63",
          "number": "1231231233"
        },
        "mobileNo": {
          "countryCode": "63",
          "number": "9479915803",
          "code": "6439",
          "dateCodeSent": {
            "$date": "2019-04-12T15:05:38.875Z"
          },
          "verified": true,
          "dateVerified": {
            "$date": "2019-04-12T15:05:51.937Z"
          }
        },
        "photo": {
          "publicID": "profile/jaycee_suqu5u",
          "url": "http://res.cloudinary.com/dealogikal/image/upload/v1557284086/profile/jaycee_suqu5u.jpg"
        }
      },
      "enrollmentStatus": "Approved",
      "accountType": "Buyer",
      "userType": "Company",
      "registration": {
        "businessProfile": {
          "companyName": "Dealo Buyer Inc.",
          "industry": "Petroleum",
          "dateFounded": "04/12/2019",
          "yearsBusiness": "1",
          "address": {
            "country": "PH",
            "address1": "Block 1 Lot 30 South Hills Subdivision",
            "address2": "Brgy. Pacita 2",
            "address3": "San Pedro",
            "address4": "Laguna",
            "postalCode": "4023"
          },
          "landlineNo": {
            "countryCode": "63",
            "number": "1231231231"
          },
          "faxNo": {
            "countryCode": "63",
            "number": "1231231231"
          },
          "businessFacilities": [
            {
              "address": {
                "country": "PH",
                "address1": "",
                "address2": "",
                "address3": "",
                "address4": "",
                "postalCode": ""
              },
              "sameAsAddress": true,
              "type": "Owned"
            }
          ],
          "purchasingContact": {
            "name": "Jaycee Caldeo",
            "contactNo": {
              "countryCode": "63",
              "number": "9479915803"
            }
          },
          "ownership": {
            "registrationType": "Sole Proprietorship",
            "registrationNo": "123123123",
            "registrationDate": "04/10/2019"
          },
          "employees": {
            "employee": "Small and Medium-Sized Businesses (0-100 Employees)",
            "contractual": "0-100 People"
          },
          "union": {
            "laborUnion": "",
            "unionAffiliation": ""
          },
          "affiliations": [
            {
              "item": ""
            }
          ],
          "products": [
            {
              "item": ""
            }
          ],
          "buyers": [
            {
              "item": ""
            }
          ],
          "competitors": [
            {
              "item": ""
            }
          ],
          "suppliers": [
            {
              "name": "",
              "supplierOf": "",
              "yearsAsSupplier": 0,
              "creditTerm": "",
              "contact": {
                "contactPerson": "",
                "contactNumber": {
                  "countryCode": "63",
                  "number": ""
                }
              }
            }
          ],
          "banks": [
            {
              "accountName": "",
              "accountNo": "",
              "bankName": "",
              "modeOfTransaction": "Credit",
              "branch": "",
              "contactNumber": {
                "countryCode": "63",
                "number": ""
              }
            }
          ],
          "TIN": "11223344",
          "taxRate": "VAT Registered",
          "businessAddress": "Southwoods, Laguna",
          "topWithholdingAgent": false
        },
        "docs": [
          {
            "file": {
              "label": "SEC Registration",
              "publicID": "registration-files/dealogikal_gguchh.png",
              "url": "http://res.cloudinary.com/dealogikal/raw/upload/v1555081696/registration-files/dealogikal_gguchh.png",
              "secureUrl": "https://res.cloudinary.com/dealogikal/raw/upload/v1555081696/registration-files/dealogikal_gguchh.png"
            },
            "type": "SEC Registration",
            "name": "SEC Registration"
          },
          {
            "file": {
              "label": "BIR Registration",
              "publicID": "registration-files/dealogikal_av0gmi.png",
              "url": "http://res.cloudinary.com/dealogikal/raw/upload/v1555081702/registration-files/dealogikal_av0gmi.png",
              "secureUrl": "https://res.cloudinary.com/dealogikal/raw/upload/v1555081702/registration-files/dealogikal_av0gmi.png"
            },
            "type": "BIR Registration",
            "name": "BIR Registration"
          },
          {
            "file": {
              "label": "Business Permit",
              "publicID": "registration-files/dealogikal_utr3ff.png",
              "url": "http://res.cloudinary.com/dealogikal/raw/upload/v1555081709/registration-files/dealogikal_utr3ff.png",
              "secureUrl": "https://res.cloudinary.com/dealogikal/raw/upload/v1555081709/registration-files/dealogikal_utr3ff.png"
            },
            "type": "Business Permit",
            "name": "Business Permit"
          },
          {
            "file": {
              "label": "Audited Financial Statement",
              "publicID": "registration-files/dealogikal_g1ebcf.png",
              "url": "http://res.cloudinary.com/dealogikal/raw/upload/v1555081716/registration-files/dealogikal_g1ebcf.png",
              "secureUrl": "https://res.cloudinary.com/dealogikal/raw/upload/v1555081716/registration-files/dealogikal_g1ebcf.png"
            },
            "type": "Audited Financial Statement",
            "name": "Audited Financial Statement"
          },
          {
            "file": {
              "label": "General Info Sheet",
              "publicID": "registration-files/dealogikal_h6nlv4.png",
              "url": "http://res.cloudinary.com/dealogikal/raw/upload/v1555081724/registration-files/dealogikal_h6nlv4.png",
              "secureUrl": "https://res.cloudinary.com/dealogikal/raw/upload/v1555081724/registration-files/dealogikal_h6nlv4.png"
            },
            "type": "General Info Sheet",
            "name": "General Info Sheet"
          }
        ],
        "conforme": {
          "conforme": true,
          "tc": true,
          "dateConforme": {
            "$date": "2019-04-12T15:08:50.832Z"
          }
        },
        "enrollment": {
          "dateApplied": {
            "$date": "2019-04-12T15:08:50.832Z"
          },
          "approvedByID": "JfKQ67xLp3mnydNHx",
          "dateApproved": {
            "$date": "2019-04-12T15:21:02.142Z"
          }
        }
      },
      "processingRate": 0.3,
      "notification": {
        "sms": true,
        "email": true
      },
      "settings": {
        "showLocation": false,
        "commodities": [
          "Petroleum",
          "Cement",
          "Aggregates",
          "Rubber",
          "Water",
          "Medical Supplies",
          "Petrochemicals",
          "Construction Materials",
          "Chemicals"
        ],
        "locations": [
          {
            "region": "NCR - National Capital Region",
            "provinces": [
              "Metro Manila"
            ]
          },
          {
            "region": "Region I - Ilocos",
            "provinces": [
              "Ilocos Norte",
              "Ilocos Sur",
              "La Union",
              "Pangasinan"
            ]
          },
          {
            "region": "CAR - Cordillera Administrative Region",
            "provinces": [
              "Abra",
              "Apayao",
              "Benguet",
              "Ifugao",
              "Kalinga",
              "Mountain Province"
            ]
          },
          {
            "region": "Region II - Cagayan Valley",
            "provinces": [
              "Batanes",
              "Cagayan",
              "Isabela",
              "Nueva Vizcaya",
              "Quirino"
            ]
          },
          {
            "region": "Region III - Central Luzon",
            "provinces": [
              "Aurora",
              "Bataan",
              "Bulacan",
              "Nueva Ecija",
              "Pampanga",
              "Tarlac",
              "Zambales"
            ]
          },
          {
            "region": "Region IV-A - CALABARZON",
            "provinces": [
              "Batangas",
              "Cavite",
              "Laguna",
              "Quezon",
              "Rizal"
            ]
          },
          {
            "region": "MIMAROPA - Southwestern Tagalog Region",
            "provinces": [
              "Marinduque",
              "Occidental Mindoro",
              "Oriental Mindoro",
              "Palawan",
              "Romblon"
            ]
          },
          {
            "region": "Region V - Bicol Region",
            "provinces": [
              "Albay",
              "Camarines Norte",
              "Camarines Sur",
              "Catanduanes",
              "Masbate",
              "Sorsogon"
            ]
          },
          {
            "region": "Region VI - Western Visayas",
            "provinces": [
              "Aklan",
              "Antique",
              "Capiz",
              "Guimaras",
              "Iloilo",
              "Negros Occidental"
            ]
          },
          {
            "region": "Region VII - Central Visayas",
            "provinces": [
              "Bohol",
              "Cebu",
              "Negros Oriental",
              "Siquijor"
            ]
          },
          {
            "region": "Region VIII - Eastern Visayas",
            "provinces": [
              "Biliran",
              "Eastern Samar",
              "Leyte",
              "Northern Samar",
              "Samar",
              "Southern Leyte"
            ]
          },
          {
            "region": "Region IX - Zamboanga Peninsula",
            "provinces": [
              "Zamboanga del Norte",
              "Zamboanga del Sur",
              "Zamboanga Sibugay"
            ]
          },
          {
            "region": "Region X - Northern Mindanao",
            "provinces": [
              "Bukidnon",
              "Camiguin",
              "Lanao del Norte",
              "Misamis Occidental",
              "Misamis Oriental"
            ]
          },
          {
            "region": "Region XI - Davao Region",
            "provinces": [
              "Compostela Valley",
              "Davao del Norte",
              "Davao del Sur",
              "Davao Occidental",
              "Davao Oriental"
            ]
          },
          {
            "region": "Region XIII - Caraga Region",
            "provinces": [
              "Agusan del Norte",
              "Agusan del Sur",
              "Dinagat Islands",
              "Surigao del Norte",
              "Surigao del Sur"
            ]
          },
          {
            "region": "BARMM - Bangsamoro Autonomous Region in Muslim Mindanao",
            "provinces": [
              "Basilan",
              "Lanao del Sur",
              "Maguindanao",
              "Sulu",
              "Tawi-Tawi"
            ]
          }
        ],
        "products": [
          {
            "commodity": "Petroleum",
            "name": "Kerosene"
          },
          {
            "commodity": "Petroleum",
            "name": "Automotive Diesel Oil"
          },
          {
            "commodity": "Petroleum",
            "name": "Oil"
          },
          {
            "commodity": "Petroleum",
            "name": "Ethanol"
          },
          {
            "commodity": "Petroleum",
            "name": "JET A-1"
          },
          {
            "commodity": "Petroleum",
            "name": "Unleaded Gasoline"
          },
          {
            "commodity": "Petroleum",
            "name": "Premium Gasoline"
          },
          {
            "commodity": "Petroleum",
            "name": "Base Oil SN150"
          },
          {
            "commodity": "Petroleum",
            "name": "Mazut M100"
          },
          {
            "commodity": "Petroleum",
            "name": "Diesel 550ppm"
          },
          {
            "commodity": "Petroleum",
            "name": "Lubricants"
          },
          {
            "commodity": "Petroleum",
            "name": "Bunker"
          },
          {
            "commodity": "Petroleum",
            "name": "Avgas"
          },
          {
            "commodity": "Petroleum",
            "name": "Total Aero D 100"
          },
          {
            "commodity": "Petroleum",
            "name": "LPG"
          },
          {
            "commodity": "Petroleum",
            "name": "Asphalt"
          },
          {
            "commodity": "Petroleum",
            "name": "Gothong Southern"
          },
          {
            "commodity": "Cement",
            "name": "Ordinary Portland Cement (33 grade)"
          },
          {
            "commodity": "Cement",
            "name": "Ordinary Portland Cement (43 grade)"
          },
          {
            "commodity": "Cement",
            "name": "Ordinary Portland Cement (53 grade)"
          },
          {
            "commodity": "Cement",
            "name": "Rapid Hardening cement"
          },
          {
            "commodity": "Cement",
            "name": "Low heat portland cement"
          },
          {
            "commodity": "Cement",
            "name": "Sulphate Resisting Portland Cement"
          },
          {
            "commodity": "Cement",
            "name": "High alumina Cement"
          },
          {
            "commodity": "Cement",
            "name": "Blast furnace slag cement"
          },
          {
            "commodity": "Cement",
            "name": "Coloured Cement"
          },
          {
            "commodity": "Cement",
            "name": "Pozzolana cement"
          },
          {
            "commodity": "Cement",
            "name": "Air-entraining cement"
          },
          {
            "commodity": "Cement",
            "name": "Hydrophobic cement"
          },
          {
            "commodity": "Cement",
            "name": "Expansive cement"
          },
          {
            "commodity": "Cement",
            "name": "White Cement"
          },
          {
            "commodity": "Cement",
            "name": "Waterproof portland cement"
          },
          {
            "commodity": "Cement",
            "name": "Oil-well Cement"
          },
          {
            "commodity": "Rubber",
            "name": "11 x 20"
          },
          {
            "commodity": "Rubber",
            "name": "14 x 24"
          },
          {
            "commodity": "Rubber",
            "name": "16 x 25"
          },
          {
            "commodity": "Water",
            "name": "Potable Water"
          }
        ],
        "forSG": false,
        "less2307": false,
        "discountRate": 0,
        "paymentOptions": [
          {
            "name": "Cash on delivery",
            "enabled": false
          },
          {
            "name": "Terms",
            "enabled": false
          }
        ],
        "cas": "Pt2rzgQw77Lgy2QgQ"
      },
      "groupName": "Dealo Buyer Inc."
    },
    {
      "_id": "seller-demo",
      "createdAt": {
        "$date": "2019-04-12T15:02:01.364Z"
      },
      "emails": [
        {
          "address": "demo.seller@gmail.com",
          "verified": true
        }
      ],
      password: 'demo.seller',
      "info": {
        "firstName": "Buyer",
        "lastName": "Dealogikal",
        "birthDate": "04/12/2000",
        "gender": "male",
        "address": {
          "country": "PH",
          "address1": "Block 1 Lot 30 South Hills Subdivision",
          "address2": "Brgy. Pacita 2",
          "address3": "San Pedro",
          "address4": "Laguna",
          "postalCode": "4023"
        },
        "landlineNo": {
          "countryCode": "63",
          "number": "1231321231"
        },
        "faxNo": {
          "countryCode": "63",
          "number": "1231231233"
        },
        "mobileNo": {
          "countryCode": "63",
          "number": "9479915803",
          "code": "6439",
          "dateCodeSent": {
            "$date": "2019-04-12T15:05:38.875Z"
          },
          "verified": true,
          "dateVerified": {
            "$date": "2019-04-12T15:05:51.937Z"
          }
        },
        "photo": {
          "publicID": "profile/jaycee_suqu5u",
          "url": "http://res.cloudinary.com/dealogikal/image/upload/v1557284086/profile/jaycee_suqu5u.jpg"
        }
      },
      "enrollmentStatus": "Approved",
      "accountType": "Buyer",
      "userType": "Company",
      "registration": {
        "businessProfile": {
          "companyName": "Dealo Buyer Inc.",
          "industry": "Petroleum",
          "dateFounded": "04/12/2019",
          "yearsBusiness": "1",
          "address": {
            "country": "PH",
            "address1": "Block 1 Lot 30 South Hills Subdivision",
            "address2": "Brgy. Pacita 2",
            "address3": "San Pedro",
            "address4": "Laguna",
            "postalCode": "4023"
          },
          "landlineNo": {
            "countryCode": "63",
            "number": "1231231231"
          },
          "faxNo": {
            "countryCode": "63",
            "number": "1231231231"
          },
          "businessFacilities": [
            {
              "address": {
                "country": "PH",
                "address1": "",
                "address2": "",
                "address3": "",
                "address4": "",
                "postalCode": ""
              },
              "sameAsAddress": true,
              "type": "Owned"
            }
          ],
          "purchasingContact": {
            "name": "Jaycee Caldeo",
            "contactNo": {
              "countryCode": "63",
              "number": "9479915803"
            }
          },
          "ownership": {
            "registrationType": "Sole Proprietorship",
            "registrationNo": "123123123",
            "registrationDate": "04/10/2019"
          },
          "employees": {
            "employee": "Small and Medium-Sized Businesses (0-100 Employees)",
            "contractual": "0-100 People"
          },
          "union": {
            "laborUnion": "",
            "unionAffiliation": ""
          },
          "affiliations": [
            {
              "item": ""
            }
          ],
          "products": [
            {
              "item": ""
            }
          ],
          "buyers": [
            {
              "item": ""
            }
          ],
          "competitors": [
            {
              "item": ""
            }
          ],
          "suppliers": [
            {
              "name": "",
              "supplierOf": "",
              "yearsAsSupplier": 0,
              "creditTerm": "",
              "contact": {
                "contactPerson": "",
                "contactNumber": {
                  "countryCode": "63",
                  "number": ""
                }
              }
            }
          ],
          "banks": [
            {
              "accountName": "",
              "accountNo": "",
              "bankName": "",
              "modeOfTransaction": "Credit",
              "branch": "",
              "contactNumber": {
                "countryCode": "63",
                "number": ""
              }
            }
          ],
          "TIN": "11223344",
          "taxRate": "VAT Registered",
          "businessAddress": "Southwoods, Laguna",
          "topWithholdingAgent": false
        },
        "docs": [
          {
            "file": {
              "label": "SEC Registration",
              "publicID": "registration-files/dealogikal_gguchh.png",
              "url": "http://res.cloudinary.com/dealogikal/raw/upload/v1555081696/registration-files/dealogikal_gguchh.png",
              "secureUrl": "https://res.cloudinary.com/dealogikal/raw/upload/v1555081696/registration-files/dealogikal_gguchh.png"
            },
            "type": "SEC Registration",
            "name": "SEC Registration"
          },
          {
            "file": {
              "label": "BIR Registration",
              "publicID": "registration-files/dealogikal_av0gmi.png",
              "url": "http://res.cloudinary.com/dealogikal/raw/upload/v1555081702/registration-files/dealogikal_av0gmi.png",
              "secureUrl": "https://res.cloudinary.com/dealogikal/raw/upload/v1555081702/registration-files/dealogikal_av0gmi.png"
            },
            "type": "BIR Registration",
            "name": "BIR Registration"
          },
          {
            "file": {
              "label": "Business Permit",
              "publicID": "registration-files/dealogikal_utr3ff.png",
              "url": "http://res.cloudinary.com/dealogikal/raw/upload/v1555081709/registration-files/dealogikal_utr3ff.png",
              "secureUrl": "https://res.cloudinary.com/dealogikal/raw/upload/v1555081709/registration-files/dealogikal_utr3ff.png"
            },
            "type": "Business Permit",
            "name": "Business Permit"
          },
          {
            "file": {
              "label": "Audited Financial Statement",
              "publicID": "registration-files/dealogikal_g1ebcf.png",
              "url": "http://res.cloudinary.com/dealogikal/raw/upload/v1555081716/registration-files/dealogikal_g1ebcf.png",
              "secureUrl": "https://res.cloudinary.com/dealogikal/raw/upload/v1555081716/registration-files/dealogikal_g1ebcf.png"
            },
            "type": "Audited Financial Statement",
            "name": "Audited Financial Statement"
          },
          {
            "file": {
              "label": "General Info Sheet",
              "publicID": "registration-files/dealogikal_h6nlv4.png",
              "url": "http://res.cloudinary.com/dealogikal/raw/upload/v1555081724/registration-files/dealogikal_h6nlv4.png",
              "secureUrl": "https://res.cloudinary.com/dealogikal/raw/upload/v1555081724/registration-files/dealogikal_h6nlv4.png"
            },
            "type": "General Info Sheet",
            "name": "General Info Sheet"
          }
        ],
        "conforme": {
          "conforme": true,
          "tc": true,
          "dateConforme": {
            "$date": "2019-04-12T15:08:50.832Z"
          }
        },
        "enrollment": {
          "dateApplied": {
            "$date": "2019-04-12T15:08:50.832Z"
          },
          "approvedByID": "JfKQ67xLp3mnydNHx",
          "dateApproved": {
            "$date": "2019-04-12T15:21:02.142Z"
          }
        }
      },
      "processingRate": 0.3,
      "notification": {
        "sms": true,
        "email": true
      },
      "settings": {
        "showLocation": false,
        "commodities": [
          "Petroleum",
          "Cement",
          "Aggregates",
          "Rubber",
          "Water",
          "Medical Supplies",
          "Petrochemicals",
          "Construction Materials",
          "Chemicals"
        ],
        "locations": [
          {
            "region": "NCR - National Capital Region",
            "provinces": [
              "Metro Manila"
            ]
          },
          {
            "region": "Region I - Ilocos",
            "provinces": [
              "Ilocos Norte",
              "Ilocos Sur",
              "La Union",
              "Pangasinan"
            ]
          },
          {
            "region": "CAR - Cordillera Administrative Region",
            "provinces": [
              "Abra",
              "Apayao",
              "Benguet",
              "Ifugao",
              "Kalinga",
              "Mountain Province"
            ]
          },
          {
            "region": "Region II - Cagayan Valley",
            "provinces": [
              "Batanes",
              "Cagayan",
              "Isabela",
              "Nueva Vizcaya",
              "Quirino"
            ]
          },
          {
            "region": "Region III - Central Luzon",
            "provinces": [
              "Aurora",
              "Bataan",
              "Bulacan",
              "Nueva Ecija",
              "Pampanga",
              "Tarlac",
              "Zambales"
            ]
          },
          {
            "region": "Region IV-A - CALABARZON",
            "provinces": [
              "Batangas",
              "Cavite",
              "Laguna",
              "Quezon",
              "Rizal"
            ]
          },
          {
            "region": "MIMAROPA - Southwestern Tagalog Region",
            "provinces": [
              "Marinduque",
              "Occidental Mindoro",
              "Oriental Mindoro",
              "Palawan",
              "Romblon"
            ]
          },
          {
            "region": "Region V - Bicol Region",
            "provinces": [
              "Albay",
              "Camarines Norte",
              "Camarines Sur",
              "Catanduanes",
              "Masbate",
              "Sorsogon"
            ]
          },
          {
            "region": "Region VI - Western Visayas",
            "provinces": [
              "Aklan",
              "Antique",
              "Capiz",
              "Guimaras",
              "Iloilo",
              "Negros Occidental"
            ]
          },
          {
            "region": "Region VII - Central Visayas",
            "provinces": [
              "Bohol",
              "Cebu",
              "Negros Oriental",
              "Siquijor"
            ]
          },
          {
            "region": "Region VIII - Eastern Visayas",
            "provinces": [
              "Biliran",
              "Eastern Samar",
              "Leyte",
              "Northern Samar",
              "Samar",
              "Southern Leyte"
            ]
          },
          {
            "region": "Region IX - Zamboanga Peninsula",
            "provinces": [
              "Zamboanga del Norte",
              "Zamboanga del Sur",
              "Zamboanga Sibugay"
            ]
          },
          {
            "region": "Region X - Northern Mindanao",
            "provinces": [
              "Bukidnon",
              "Camiguin",
              "Lanao del Norte",
              "Misamis Occidental",
              "Misamis Oriental"
            ]
          },
          {
            "region": "Region XI - Davao Region",
            "provinces": [
              "Compostela Valley",
              "Davao del Norte",
              "Davao del Sur",
              "Davao Occidental",
              "Davao Oriental"
            ]
          },
          {
            "region": "Region XIII - Caraga Region",
            "provinces": [
              "Agusan del Norte",
              "Agusan del Sur",
              "Dinagat Islands",
              "Surigao del Norte",
              "Surigao del Sur"
            ]
          },
          {
            "region": "BARMM - Bangsamoro Autonomous Region in Muslim Mindanao",
            "provinces": [
              "Basilan",
              "Lanao del Sur",
              "Maguindanao",
              "Sulu",
              "Tawi-Tawi"
            ]
          }
        ],
        "products": [
          {
            "commodity": "Petroleum",
            "name": "Kerosene"
          },
          {
            "commodity": "Petroleum",
            "name": "Automotive Diesel Oil"
          },
          {
            "commodity": "Petroleum",
            "name": "Oil"
          },
          {
            "commodity": "Petroleum",
            "name": "Ethanol"
          },
          {
            "commodity": "Petroleum",
            "name": "JET A-1"
          },
          {
            "commodity": "Petroleum",
            "name": "Unleaded Gasoline"
          },
          {
            "commodity": "Petroleum",
            "name": "Premium Gasoline"
          },
          {
            "commodity": "Petroleum",
            "name": "Base Oil SN150"
          },
          {
            "commodity": "Petroleum",
            "name": "Mazut M100"
          },
          {
            "commodity": "Petroleum",
            "name": "Diesel 550ppm"
          },
          {
            "commodity": "Petroleum",
            "name": "Lubricants"
          },
          {
            "commodity": "Petroleum",
            "name": "Bunker"
          },
          {
            "commodity": "Petroleum",
            "name": "Avgas"
          },
          {
            "commodity": "Petroleum",
            "name": "Total Aero D 100"
          },
          {
            "commodity": "Petroleum",
            "name": "LPG"
          },
          {
            "commodity": "Petroleum",
            "name": "Asphalt"
          },
          {
            "commodity": "Petroleum",
            "name": "Gothong Southern"
          },
          {
            "commodity": "Cement",
            "name": "Ordinary Portland Cement (33 grade)"
          },
          {
            "commodity": "Cement",
            "name": "Ordinary Portland Cement (43 grade)"
          },
          {
            "commodity": "Cement",
            "name": "Ordinary Portland Cement (53 grade)"
          },
          {
            "commodity": "Cement",
            "name": "Rapid Hardening cement"
          },
          {
            "commodity": "Cement",
            "name": "Low heat portland cement"
          },
          {
            "commodity": "Cement",
            "name": "Sulphate Resisting Portland Cement"
          },
          {
            "commodity": "Cement",
            "name": "High alumina Cement"
          },
          {
            "commodity": "Cement",
            "name": "Blast furnace slag cement"
          },
          {
            "commodity": "Cement",
            "name": "Coloured Cement"
          },
          {
            "commodity": "Cement",
            "name": "Pozzolana cement"
          },
          {
            "commodity": "Cement",
            "name": "Air-entraining cement"
          },
          {
            "commodity": "Cement",
            "name": "Hydrophobic cement"
          },
          {
            "commodity": "Cement",
            "name": "Expansive cement"
          },
          {
            "commodity": "Cement",
            "name": "White Cement"
          },
          {
            "commodity": "Cement",
            "name": "Waterproof portland cement"
          },
          {
            "commodity": "Cement",
            "name": "Oil-well Cement"
          },
          {
            "commodity": "Rubber",
            "name": "11 x 20"
          },
          {
            "commodity": "Rubber",
            "name": "14 x 24"
          },
          {
            "commodity": "Rubber",
            "name": "16 x 25"
          },
          {
            "commodity": "Water",
            "name": "Potable Water"
          }
        ],
        "forSG": false,
        "less2307": false,
        "discountRate": 0,
        "paymentOptions": [
          {
            "name": "Cash on delivery",
            "enabled": false
          },
          {
            "name": "Terms",
            "enabled": false
          }
        ],
        "cas": "Pt2rzgQw77Lgy2QgQ"
      },
      "groupName": "Dealo Buyer Inc."
    }
  ])

  get():Observable<any> {
    return this.users$.asObservable();
  }

  constructor() { }
}
