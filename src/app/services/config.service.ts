import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
 
  constructor() { }

  getCountries(): Observable<any> {
    return new Observable((obs) => {
      obs.next(
        [
          {
            "code2": "PH",
            "code3": "PHL",
            "name": "Philippines",
            "capital": "Manila",
            "region": "Asia",
            "subregion": "South-Eastern Asia",
            "states": [
              {
                "code": "00",
                "name": "NCR - National Capital Region",
                "subdivision": [
                  "Metro Manila"
                ]
              },
              {
                "code": "01",
                "name": "Region I - Ilocos",
                "subdivision": [
                  "Ilocos Norte",
                  "Ilocos Sur",
                  "La Union",
                  "Pangasinan"
                ]
              },
              {
                "code": "15",
                "name": "CAR - Cordillera Administrative Region",
                "subdivision": [
                  "Abra",
                  "Apayao",
                  "Benguet",
                  "Ifugao",
                  "Kalinga",
                  "Mountain Province"
                ]
              },
              {
                "code": "02",
                "name": "Region II - Cagayan Valley",
                "subdivision": [
                  "Batanes",
                  "Cagayan",
                  "Isabela",
                  "Nueva Vizcaya",
                  "Quirino"
                ]
              },
              {
                "code": "03",
                "name": "Region III - Central Luzon",
                "subdivision": [
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
                "code": "40",
                "name": "Region IV-A - CALABARZON",
                "subdivision": [
                  "Batangas",
                  "Cavite",
                  "Laguna",
                  "Quezon",
                  "Rizal"
                ]
              },
              {
                "code": "41",
                "name": "MIMAROPA - Southwestern Tagalog Region",
                "subdivision": [
                  "Marinduque",
                  "Occidental Mindoro",
                  "Oriental Mindoro",
                  "Palawan",
                  "Romblon"
                ]
              },
              {
                "code": "05",
                "name": "Region V - Bicol Region",
                "subdivision": [
                  "Albay",
                  "Camarines Norte",
                  "Camarines Sur",
                  "Catanduanes",
                  "Masbate",
                  "Sorsogon"
                ]
              },
              {
                "code": "06",
                "name": "Region VI - Western Visayas",
                "subdivision": [
                  "Aklan",
                  "Antique",
                  "Capiz",
                  "Guimaras",
                  "Iloilo",
                  "Negros Occidental"
                ]
              },
              {
                "code": "07",
                "name": "Region VII - Central Visayas",
                "subdivision": [
                  "Bohol",
                  "Cebu",
                  "Negros Oriental",
                  "Siquijor"
                ]
              },
              {
                "code": "08",
                "name": "Region VIII - Eastern Visayas",
                "subdivision": [
                  "Biliran",
                  "Eastern Samar",
                  "Leyte",
                  "Northern Samar",
                  "Samar",
                  "Southern Leyte"
                ]
              },
              {
                "code": "09",
                "name": "Region IX - Zamboanga Peninsula",
                "subdivision": [
                  "Zamboanga del Norte",
                  "Zamboanga del Sur",
                  "Zamboanga Sibugay"
                ]
              },
              {
                "code": "10",
                "name": "Region X - Northern Mindanao",
                "subdivision": [
                  "Bukidnon",
                  "Camiguin",
                  "Lanao del Norte",
                  "Misamis Occidental",
                  "Misamis Oriental"
                ]
              },
              {
                "code": "11",
                "name": "Region XI - Davao Region",
                "subdivision": [
                  "Compostela Valley",
                  "Davao del Norte",
                  "Davao del Sur",
                  "Davao Occidental",
                  "Davao Oriental"
                ]
              },
              {
                "code": "13",
                "name": "Region XIII - Caraga Region",
                "subdivision": [
                  "Agusan del Norte",
                  "Agusan del Sur",
                  "Dinagat Islands",
                  "Surigao del Norte",
                  "Surigao del Sur"
                ]
              },
              {
                "code": "14",
                "name": "BARMM - Bangsamoro Autonomous Region in Muslim Mindanao",
                "subdivision": [
                  "Basilan",
                  "Lanao del Sur",
                  "Maguindanao",
                  "Sulu",
                  "Tawi-Tawi"
                ]
              }
            ]
          }
        ]
      );
      obs.complete();
    })
  }

  getBanks(): Observable<any> {
    return new Observable((obs) => {
      obs.next([
        {
          "bank": "BDO",
          "accountNo": "0061 2801 1029",
          "accountName": "Dealogikal Corp."
        },
        {
          "bank": "Unionbank",
          "accountNo": "0030 8000 0338",
          "accountName": "DEALOGIKAL CORP"
        },
        {
          "bank": "Eastwest Bank",
          "accountNo": "200040319367",
          "accountName": "DEALOGIKAL CORP"
        }
      ]);
      obs.complete();
    })
  }

  getMaxOffer(): Observable<any> {
    return new Observable((obs) => {
      obs.next(5);
      obs.complete();
    })
  }


  getPaymentOptionsReqs(): Observable<any> {
    return new Observable((obs) => {
      obs.next([
        {
          name: 'Cash on delivery',
          prop: 'cod',
          docs: [
            { name: "SEC Registration" },
            { name: "BIR Registration" },
            { name: "Business Permit" },
            { name: "Audited Financial Statement" },
            { name: "General Info Sheet" },
            // { name: "Insurance" },
          ]
        }
      ]);
      obs.complete();
    })
  }
  getDocuments(): Observable<any> {
    return new Observable((obs) => {
      obs.next([
        {
          name: "SEC Registration",
          required: true,
        },
        {
          name: "BIR Registration",
          required: true,
        },
        {
          name: "Business Permit",
          required: true,
        },
        {
          name: "Audited Financial Statement",
          required: true,
        },
        {
          name: "General Info Sheet",
          required: true,
        },
        {
          name: "Insurance",
          required: false,
        },
      ]);
      obs.complete();
    });
  }
  getShippingMethod(): Observable<any> {
    return new Observable((obs) => {
      obs.next(["Deliver", "Pick up"]);
      obs.complete();
    });
  }


  getCommodities(): Observable<any> {
    return new Observable((obs) => {
      obs.next([{
        "_id": "8SYbJGBJS96u6ffvS",
        "name": "Aggregates",
        "advisor": {
          "type": "Fee",
          "range": []
        },
        "details": {
          "origin": "Philippines",
          "image": "/assets/img/registration/aggregates.svg",
          "icon": "/assets/img/registration/aggregates.svg",
          "description": "Aggregates Products"
        },
        "products": []
      }, {
        "_id": "zoXKZTRDEWk463ks2",
        "name": "Rubber",
        "advisor": {
          "type": "Fee",
          "range": []
        },
        "details": {
          "origin": "Philippines",
          "image": "/assets/img/registration/rubber.svg",
          "icon": "/assets/img/registration/rubber.svg",
          "description": "Rubber Products"
        },
        "products": [
          {
            "name": "MRF",
            "type": [
              {
                "name": "11 x 20",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/rubber.svg",
                  "icon": "/assets/img/registration/rubber.svg",
                  "description": "Rubber Product"
                }
              },
              {
                "name": "14 x 24",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/rubber.svg",
                  "icon": "/assets/img/registration/rubber.svg",
                  "description": "Rubber Product"
                }
              },
              {
                "name": "16 x 25",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/rubber.svg",
                  "icon": "/assets/img/registration/rubber.svg",
                  "description": "Rubber Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Piece",
                "abbr": "PC",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "MRF Product"
            },
            "minParticipants": 3
          },
          {
            "name": "CEAT",
            "type": [
              {
                "name": "11 x 20",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/rubber.svg",
                  "icon": "/assets/img/registration/rubber.svg",
                  "description": "Rubber Product"
                }
              },
              {
                "name": "14 x 24",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/rubber.svg",
                  "icon": "/assets/img/registration/rubber.svg",
                  "description": "Rubber Product"
                }
              },
              {
                "name": "16 x 25",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/rubber.svg",
                  "icon": "/assets/img/registration/rubber.svg",
                  "description": "Rubber Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Piece",
                "abbr": "PC",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "MRF Product"
            },
            "minParticipants": 3
          }
        ]
      }, {
        "_id": "dZdRccwB6zwE3EwLf",
        "name": "Water",
        "advisor": {
          "type": "Fee",
          "range": []
        },
        "details": {
          "origin": "Philippines",
          "image": "/assets/img/registration/water.svg",
          "icon": "/assets/img/registration/water.svg",
          "description": "Water Products"
        },
        "products": [
          {
            "name": "Potable Water",
            "type": [],
            "unit": [
              {
                "unit": "Gallon",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/water.svg",
              "icon": "/assets/img/registration/water.svg",
              "description": "Potable Water Product"
            },
            "minParticipants": 3
          }
        ]
      }, {
        "_id": "NN2iNwGNkKo6EdCBy",
        "name": "Petroleum",
        "advisor": {
          "type": "Fee",
          "range": []
        },
        "details": {
          "origin": "Philippines",
          "image": "/assets/img/registration/petroleum.svg",
          "icon": "/assets/img/registration/petroleum.svg",
          "description": "Oil and Gas Products"
        },
        "products": [
          {
            "name": "Kerosene",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Kerosene Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Light Sulfur Fuel Oil",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Light Sulfur Fuel Oil Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Blaze 100 Euro 6",
            "type": [],
            "unit": [
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Blaze 100 Euro 6 Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Automotive Diesel Oil",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Automotive Diesel Oil Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Oil",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Kerosene Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Ethanol",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Ethanol Product"
            },
            "minParticipants": 3
          },
          {
            "name": "JET A-1",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "JET A-1 Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Unleaded Gasoline",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Unleaded Gasoline Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Premium Gasoline",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Premium Gasoline Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Base Oil SN150",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Base Oil SN150 Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Mazut M100",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Mazut M100 Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Diesel 550ppm",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Diesel 550ppm Product"
            },
            "minParticipants": 3
          },
          {
            "name": "SFO 60",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Diesel 550ppm Product"
            },
            "minParticipants": 3
          },
          {
            "name": "SFO 200",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Diesel 550ppm Product"
            },
            "minParticipants": 3
          },
          {
            "name": "SFO 400",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Diesel 550ppm Product"
            },
            "minParticipants": 3
          },
          {
            "name": "SFO 1100",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Diesel 550ppm Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Lubricants",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Lubricants Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Bunker",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Bunker Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Avgas",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Avgas Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Total Aero D 100",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Total Aero D 100 Product"
            },
            "minParticipants": 3
          },
          {
            "name": "LPG",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "LPG Products"
            },
            "minParticipants": 3
          },
          {
            "name": "Asphalt",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Asphalt Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Gothong Southern",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              },
              {
                "unit": "Gallons",
                "abbr": "GL",
                "minQty": 1000
              },
              {
                "unit": "Metrictons",
                "abbr": "MT",
                "minQty": 1000
              },
              {
                "unit": "Drums",
                "abbr": "DRM",
                "minQty": 1000
              },
              {
                "unit": "Pail",
                "abbr": "PL",
                "minQty": 1000
              },
              {
                "unit": "Kilos",
                "abbr": "KL",
                "minQty": 1000
              },
              {
                "unit": "Tanks",
                "abbr": "TNK",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/petroleum.svg",
              "icon": "/assets/img/registration/petroleum.svg",
              "description": "Gothong Southern"
            },
            "minParticipants": 3
          }
        ]
      }, {
        "_id": "QgnfDi3MjCfGg5W6b",
        "name": "Medical Supplies",
        "advisor": {
          "type": "Commission",
          "range": [
            {
              "min": 1000,
              "max": 100000,
              "percentage": 0
            },
            {
              "min": 100001,
              "max": 500000,
              "percentage": 0
            },
            {
              "min": 500001,
              "max": 1000000,
              "percentage": 0
            },
            {
              "min": 1000001,
              "max": 5000000,
              "percentage": 0
            },
            {
              "min": 5000001,
              "max": 10000000,
              "percentage": 0
            },
            {
              "min": 10000001,
              "max": 100000000000,
              "percentage": 0
            }
          ]
        },
        "details": {
          "origin": "Philippines",
          "image": "/assets/img/registration/medical.svg",
          "icon": "/assets/img/registration/medical.svg",
          "description": "Medical Supplies Product"
        },
        "products": [
          {
            "name": "Medical Masks",
            "type": [
              {
                "name": "N95 Mask",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  },
                  {
                    "unit": "Box",
                    "abbr": "Box",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "/assets/img/registration/medical.svg",
                  "icon": "/assets/img/registration/medical.svg",
                  "description": "Medical Supplies Product"
                }
              },
              {
                "name": "Surgical Mask",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  },
                  {
                    "unit": "Box",
                    "abbr": "Box",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "/assets/img/registration/medical.svg",
                  "icon": "/assets/img/registration/medical.svg",
                  "description": "Medical Supplies Product"
                }
              },
              {
                "name": "Faceshield",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  },
                  {
                    "unit": "Box",
                    "abbr": "Box",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "/assets/img/registration/medical.svg",
                  "icon": "/assets/img/registration/medical.svg",
                  "description": "Medical Supplies Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Piece",
                "abbr": "PC",
                "minQty": 1000
              },
              {
                "unit": "Box",
                "abbr": "Box",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/medical.svg",
              "icon": "/assets/img/registration/medical.svg",
              "description": "Medical Supplies Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Medical Gloves",
            "type": [
              {
                "name": "Surgical Gloves",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  },
                  {
                    "unit": "Box",
                    "abbr": "Box",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "/assets/img/registration/medical.svg",
                  "icon": "/assets/img/registration/medical.svg",
                  "description": "Medical Supplies Product"
                }
              },
              {
                "name": "Examination Gloves",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  },
                  {
                    "unit": "Box",
                    "abbr": "Box",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "/assets/img/registration/medical.svg",
                  "icon": "/assets/img/registration/medical.svg",
                  "description": "Medical Supplies Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Piece",
                "abbr": "PC",
                "minQty": 1000
              },
              {
                "unit": "Box",
                "abbr": "Box",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/medical.svg",
              "icon": "/assets/img/registration/medical.svg",
              "description": "Medical Supplies Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Medical Suits",
            "type": [
              {
                "name": "Anti-virus Protective Suits",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "/assets/img/registration/medical.svg",
                  "icon": "/assets/img/registration/medical.svg",
                  "description": "Medical Supplies Product"
                }
              },
              {
                "name": "Coverall",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "/assets/img/registration/medical.svg",
                  "icon": "/assets/img/registration/medical.svg",
                  "description": "Medical Supplies Product"
                }
              },
              {
                "name": "Surgical Gown",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "/assets/img/registration/medical.svg",
                  "icon": "/assets/img/registration/medical.svg",
                  "description": "Medical Supplies Product"
                }
              },
              {
                "name": "Isolation Gown",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "/assets/img/registration/medical.svg",
                  "icon": "/assets/img/registration/medical.svg",
                  "description": "Medical Supplies Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Piece",
                "abbr": "PC",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/medical.svg",
              "icon": "/assets/img/registration/medical.svg",
              "description": "Medical Supplies Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Sanitation Products",
            "type": [
              {
                "name": "Ethyl Alcohol",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "/assets/img/registration/medical.svg",
                  "icon": "/assets/img/registration/medical.svg",
                  "description": "Medical Supplies Product"
                }
              },
              {
                "name": "Isopropyl Alcohol",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "/assets/img/registration/medical.svg",
                  "icon": "/assets/img/registration/medical.svg",
                  "description": "Medical Supplies Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Piece",
                "abbr": "PC",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/medical.svg",
              "icon": "/assets/img/registration/medical.svg",
              "description": "Medical Supplies Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Equipments",
            "type": [
              {
                "name": "Breathing Machines",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "/assets/img/registration/medical.svg",
                  "icon": "/assets/img/registration/medical.svg",
                  "description": "Medical Supplies Product"
                }
              },
              {
                "name": "Forehead Thermometer",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "/assets/img/registration/medical.svg",
                  "icon": "/assets/img/registration/medical.svg",
                  "description": "Medical Supplies Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Piece",
                "abbr": "PC",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/medical.svg",
              "icon": "/assets/img/registration/medical.svg",
              "description": "Medical Supplies Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Test Kits",
            "type": [
              {
                "name": "Covid-19 IgM/IgG",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "/assets/img/registration/medical.svg",
                  "icon": "/assets/img/registration/medical.svg",
                  "description": "Medical Supplies Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Piece",
                "abbr": "PC",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/medical.svg",
              "icon": "/assets/img/registration/medical.svg",
              "description": "Medical Supplies Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Vaccines",
            "type": [
              {
                "name": "Flu Vaccine",
                "unit": [
                  {
                    "unit": "Piece",
                    "abbr": "PC",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "/assets/img/registration/medical.svg",
                  "icon": "/assets/img/registration/medical.svg",
                  "description": "Medical Supplies Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Piece",
                "abbr": "PC",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/medical.svg",
              "icon": "/assets/img/registration/medical.svg",
              "description": "Medical Supplies Product"
            },
            "minParticipants": 3
          }
        ]
      }, {
        "_id": {
          "$oid": "5fb49917eae66216e41ef0d2"
        },
        "name": "Construction Materials",
        "advisor": {
          "type": "Fee",
          "range": []
        },
        "details": {
          "origin": "Philippines",
          "image": "/assets/img/registration/cement.svg",
          "icon": "/assets/img/registration/cement.svg",
          "description": "Construction Materials Products"
        },
        "products": [
          {
            "name": "Bearings",
            "type": [],
            "unit": [
              {
                "unit": "Piece",
                "abbr": "PC",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "Bearings Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Drill bits",
            "type": [],
            "unit": [
              {
                "unit": "Piece",
                "abbr": "PC",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "Drill bits Product"
            },
            "minParticipants": 3
          }
        ]
      }, {
        "_id": "zzaH3ErWK6tD55j4Z",
        "name": "Petrochemicals",
        "advisor": {
          "type": "Fee",
          "range": []
        },
        "details": {
          "origin": "Philippines",
          "image": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
          "icon": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
          "description": "Petrochemical Products"
        },
        "products": [
          {
            "name": "Biodiesel (CME) / BioActiv BD-800",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 30000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
              "icon": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
              "description": "A natural Euro 5 compliant cocobiodiesel in terms of sulphur specification and of the required emission reduction of hydrocarbon (HC) and Particulate Matter (PM) when used neat. It is a premium quality enhancer when blended with fossil diesel due to its natural fuel properties superior to petroleum diesel since it optimizes engine performance thru its many unique quality enhancing features. Can be used as diesel fuel additive (or quality enhancer) in any ratio."
            },
            "minParticipants": 3
          },
          {
            "name": "Blackstarr Diesel Enhancer",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 20
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
              "icon": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
              "description": "It is an organic industrial fuel improver packed with many performance additive features inherent in the product. It exhibits superb features in enhancing engine efficiency; and in elimination or substantial reduction of emissions of environmental pollutants from industrial fuels such as industrial diesel oil (IDO) or industrial fuel oil (IFO). It is uniquely blended with IDO or IFO in any quantity ranging from 5% even up to 80%. It is ideal for use in heavy equipment, ship engines, power plant genset, locomotives, tractors and trailers, and all medium and low speed internal combustion diesel engines to ensure engine cleanliness and optimum performance. It is recommended as performance – enhancing additive for industrial fuels in a ratio of 5% - 80% since it can be used as neat fuel for medium speed diesel engines."
            },
            "minParticipants": 3
          },
          {
            "name": "Hydraulic Brake Fluid (CTI Brake Fluid Dot-3 & Dot-4)",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 20
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
              "icon": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
              "description": "Complies with the International Standards. For automotive use"
            },
            "minParticipants": 3
          },
          {
            "name": "CTI Engine Radiator Coolant",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 20
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
              "icon": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
              "description": "It is the most advanced eco-friendly coolant; it is Phosphate, Nitrite, Amine-free (NAP free). It is also a high quality monoethylene glycol based fluid incorporated with rust and corrosion inhibitor. Designed for use in automotive, light and heavy duty diesel application. Recommended for engine water cooling system. Anti-freeze concentration of 30% to 50% or as recommended by vehicle manufacturer. For best protection 50% concentration will give maximum protection required."
            },
            "minParticipants": 3
          },
          {
            "name": "Green Solvents",
            "type": [
              {
                "name": "Surfasol P-450",
                "unit": [
                  {
                    "unit": "Drums",
                    "abbr": "DRM",
                    "minQty": 5
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
                  "icon": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
                  "description": "It is a light, plant-based and non-aromatic solvent which has a dissolving power higher than acetone and diesel. It can be positioned as a green solvent carrier in various oil and gas field chemical formulations such as for asphaltene, paraffin and scale cleaning. It can be used as replacement of petroleum-derived solvents as carrier in oil and gas chemical formulations. It is compatible with all oil-soluble actives and surfactants used in the oil and gas industry."
                }
              },
              {
                "name": "Dispersa",
                "unit": [
                  {
                    "unit": "Liters",
                    "abbr": "L",
                    "minQty": 20
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
                  "icon": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
                  "description": "It is an organic, plant-based and non-aromatic solvent. It can be used as a solvency enhancer in the formulation of solvents and cleaners for various applications such as printing ink, paint, household cleaners, and oil and gas industries. It is a solvent that can be used in the formulation of all types of solvents and cleaners."
                }
              }
            ],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 20
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
              "icon": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
              "description": "Green Solvents Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Cleaners and Degreasers",
            "type": [
              {
                "name": "Surfasol P-900",
                "unit": [
                  {
                    "unit": "Drum",
                    "abbr": "DRM",
                    "minQty": 5
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
                  "icon": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
                  "description": "It is an organic, plant based non-aromatic solvent and cleaner. It has excellent solvency property for various oilfield applications as direct replacement for most petroleum-derived solvents and cleaners. It is an excellent alternative to traditional fossil-based solvents used in oilfield applications. It has excellent cleaning and degreasing property."
                }
              },
              {
                "name": "Surfasol O-150",
                "unit": [
                  {
                    "unit": "Liters",
                    "abbr": "L",
                    "minQty": 20
                  },
                  {
                    "unit": "Pail",
                    "abbr": "PL",
                    "minQty": 10
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
                  "icon": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
                  "description": "It is a concentrated oil soluble degreaser that has excellent grease cutting and solvency properties. It breaks viscous oil into fine particles and loosen their stickiness on surfaces to allow easy rinsing. It is effective in cleaning storage tanks, vessels, metal or concrete floors, decks, concrete runways, drilling rigs, greasy engines and machineries, heavy equipment, and oil soiled surfaces."
                }
              },
              {
                "name": "Surfasol W-250",
                "unit": [
                  {
                    "unit": "Liters",
                    "abbr": "L",
                    "minQty": 20
                  },
                  {
                    "unit": "Pail",
                    "abbr": "PL",
                    "minQty": 10
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
                  "icon": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
                  "description": "It is an organic water emulsifiable degreaser and cleaner. It contains a proprietary surfactant blend especially formulated to replace chlorinated and paraffin based solvents in cleaning and removing oily and greasy surfaces of cargo tanks, decks of vessels and drilling rigs, runways, hangars, roadways, service bays, garages and other oil soiled surfaces. It is effective for degreasing, cleaning and maintaining cargo tanks, decks of vessels and barges, airport runways, floors of garages and transport terminals, concrete roads and others."
                }
              }
            ],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 20
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
              "icon": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
              "description": "Cleaners and Degreasers Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Oil Spill Dispersant",
            "type": [
              {
                "name": "Biosolve Spill Rx",
                "unit": [
                  {
                    "unit": "Liters",
                    "abbr": "L",
                    "minQty": 20
                  }
                ],
                "details": {
                  "origin": "Philippines",
                  "image": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
                  "icon": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
                  "description": "Quickly disperses any oil or hydrocarbon spills with utmost concern for safety of the environment and the responding team. It is a plant based non-hazardous, non-toxic, biodegradable formulation that expedites the removal of spilled hydrocarbon oils. It can be used to clean up oil spills on bodies of water."
                }
              }
            ],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 20
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
              "icon": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/petrochemicals.svg",
              "description": "Oil Spill Dispersant Product"
            },
            "minParticipants": 3
          }
        ]
      }, {
        "_id": {
          "$oid": "603d978d8c771dbe85b43360"
        },
        "name": "Cement",
        "advisor": {
          "type": "Fee",
          "range": []
        },
        "details": {
          "origin": "Philippines",
          "image": "/assets/img/registration/cement.svg",
          "icon": "/assets/img/registration/cement.svg",
          "description": "Cement Products"
        },
        "products": [
          {
            "name": "Ordinary Portland Cement (33 grade)",
            "type": [
              {
                "name": "Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              },
              {
                "name": "Non Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Bags",
                "abbr": "BG",
                "minQty": 1000
              },
              {
                "unit": "Tonner",
                "abbr": "Tonner",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "Ordinary Portland Cement (33 grade) Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Ordinary Portland Cement (43 grade)",
            "type": [
              {
                "name": "Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              },
              {
                "name": "Non Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Bags",
                "abbr": "BG",
                "minQty": 1000
              },
              {
                "unit": "Tonner",
                "abbr": "Tonner",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "Ordinary Portland Cement (43 grade) Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Ordinary Portland Cement (53 grade)",
            "type": [
              {
                "name": "Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              },
              {
                "name": "Non Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Bags",
                "abbr": "BG",
                "minQty": 1000
              },
              {
                "unit": "Tonner",
                "abbr": "Tonner",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "Ordinary Portland Cement (53 grade) Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Rapid Hardening cement",
            "type": [
              {
                "name": "Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              },
              {
                "name": "Non Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Bags",
                "abbr": "BG",
                "minQty": 1000
              },
              {
                "unit": "Tonner",
                "abbr": "Tonner",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "Rapid Hardening cement Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Low heat portland cement",
            "type": [
              {
                "name": "Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              },
              {
                "name": "Non Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Bags",
                "abbr": "BG",
                "minQty": 1000
              },
              {
                "unit": "Tonner",
                "abbr": "Tonner",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "Low heat portland cement Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Sulphate Resisting Portland Cement",
            "type": [
              {
                "name": "Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              },
              {
                "name": "Non Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Bags",
                "abbr": "BG",
                "minQty": 1000
              },
              {
                "unit": "Tonner",
                "abbr": "Tonner",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "Sulphate Resisting Portland Cement Product"
            },
            "minParticipants": 3
          },
          {
            "name": "High alumina Cement",
            "type": [
              {
                "name": "Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              },
              {
                "name": "Non Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Bags",
                "abbr": "BG",
                "minQty": 1000
              },
              {
                "unit": "Tonner",
                "abbr": "Tonner",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "High alumina Cement Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Blast furnace slag cement",
            "type": [
              {
                "name": "Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              },
              {
                "name": "Non Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Bags",
                "abbr": "BG",
                "minQty": 1000
              },
              {
                "unit": "Tonner",
                "abbr": "Tonner",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "Blast furnace slag cement Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Coloured Cement",
            "type": [
              {
                "name": "Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              },
              {
                "name": "Non Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Bags",
                "abbr": "BG",
                "minQty": 1000
              },
              {
                "unit": "Tonner",
                "abbr": "Tonner",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "Coloured Cement Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Pozzolana cement",
            "type": [
              {
                "name": "Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              },
              {
                "name": "Non Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Bags",
                "abbr": "BG",
                "minQty": 1000
              },
              {
                "unit": "Tonner",
                "abbr": "Tonner",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "Pozzolana cement Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Air-entraining cement",
            "type": [
              {
                "name": "Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              },
              {
                "name": "Non Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Bags",
                "abbr": "BG",
                "minQty": 1000
              },
              {
                "unit": "Tonner",
                "abbr": "Tonner",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "Air-entraining cement Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Hydrophobic cement",
            "type": [
              {
                "name": "Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              },
              {
                "name": "Non Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Bags",
                "abbr": "BG",
                "minQty": 1000
              },
              {
                "unit": "Tonner",
                "abbr": "Tonner",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "Hydrophobic cement Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Expansive cement",
            "type": [
              {
                "name": "Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              },
              {
                "name": "Non Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Bags",
                "abbr": "BG",
                "minQty": 1000
              },
              {
                "unit": "Tonner",
                "abbr": "Tonner",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "Expansive cement Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Waterproof portland cement",
            "type": [
              {
                "name": "Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              },
              {
                "name": "Non Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Bags",
                "abbr": "BG",
                "minQty": 1000
              },
              {
                "unit": "Tonner",
                "abbr": "Tonner",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "Waterproof portland cement Product"
            },
            "minParticipants": 3
          },
          {
            "name": "Oil-well cement",
            "type": [
              {
                "name": "Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              },
              {
                "name": "Non Hydraulic",
                "unit": [
                  {
                    "unit": "Bags",
                    "abbr": "BG",
                    "minQty": 1000
                  },
                  {
                    "unit": "Tonner",
                    "abbr": "Tonner",
                    "minQty": 1000
                  }
                ],
                "details": {
                  "image": "/assets/img/registration/cement.svg",
                  "icon": "/assets/img/registration/cement.svg",
                  "description": "Cement Product"
                }
              }
            ],
            "unit": [
              {
                "unit": "Bags",
                "abbr": "BG",
                "minQty": 1000
              },
              {
                "unit": "Tonner",
                "abbr": "Tonner",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "/assets/img/registration/cement.svg",
              "icon": "/assets/img/registration/cement.svg",
              "description": "Oil-well cement Product"
            },
            "minParticipants": 3
          }
        ]
      }, {
        "_id": "zzaH3ErWK6tD55j9Y",
        "name": "Chemicals",
        "advisor": {
          "type": "Fee",
          "range": []
        },
        "details": {
          "origin": "Philippines",
          "image": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/chemicals.svg",
          "icon": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/chemicals.svg",
          "description": "Chemical Products"
        },
        "products": [
          {
            "name": "Methanol",
            "type": [],
            "unit": [
              {
                "unit": "Liters",
                "abbr": "L",
                "minQty": 1000
              }
            ],
            "details": {
              "origin": "Philippines",
              "image": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/chemicals.svg",
              "icon": "https://res.cloudinary.com/dealogikal/image/upload/v1614062298/assets/commodities/chemicals.svg",
              "description": "Methanol Products"
            },
            "minParticipants": 3
          }
        ]
      }]);
      obs.complete();
    });
  }


  getPaymentOptions(): Observable<any> {

    return new Observable((obs) => {
      obs.next([
        {
          "method": "Terms",
          "options": [
            {
              "type": "Kapital/In-house Financing",
              "channel": [
                "5",
                "10",
                "15",
                "20",
                "30"
              ]
            }
          ],
          "disabled": true
        },
        {
          "method": "Cash before delivery",
          "options": [
            {
              "type": "CC/Debit Card",
              "channel": [
                "PayMaya Online",
                "PayMaya Local Terminal",
                "BDO Commercial Card"
              ]
            },
            {
              "type": "Bank Transfer",
              "channel": [
                "Upload deposit slip"
              ]
            }
          ],
          "disabled": false
        },
        {
          "method": "Cash on delivery",
          "options": [
            {
              "type": "CC/Debit Card",
              "channel": [
                "PayMaya Online",
                "PayMaya Local Terminal"
              ]
            },
            {
              "type": "Bank Transfer",
              "channel": [
                "Upload deposit slip"
              ]
            }
          ],
          "disabled": false
        }
      ]);
      obs.complete();
    });
  }

}
