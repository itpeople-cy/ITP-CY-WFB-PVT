package main

type Product struct {
	ObjectType      string   `json:"objectType"`
	ProductID       string   `json:"productID"`
	StyleID         string   `json:"styleID"`
	FactoryID       string   `json:"factoryID"`
	TagID           string   `json:"tagID"`
	BrandID         string   `json:"brandID"`
	ManufacturerID  string   `json:"manufacturerID"`
	RetailerID      string   `json:"retailerID"`
	SKUID           string   `json:"skuID"`
	UPCode          string   `json:"upCode"`
	OrderNumber     string   `json:"orderNumber"`
	Color           string   `json:"color"`
	MSRP            string   `json:"msrp"`
	ManufactureDate string   `json:"manufactureDate"`
	ShippedDate     string   `json:"shippedDate"`
	ImageIDs        []string `json:"imageIDs"`
}

type ProductStyle struct {
	ObjectType  string   `json:"objectType"`
	StyleID     string   `json:"styleID"`
	BrandID     string   `json:"brandID"`
	Name        string   `json:"name"`
	Size        string   `json:"size"`
	Weight      string   `json:"weight"`
	Description string   `json:"description"`
	ImageIDs    []string `json:"imageIDs"`
}

type ProductStyleSignature struct {
	ObjectType        string `json:"objectType"`
	StyleID           string `json:"productProfileID"`
	SignatureDocument string `json:"signatureDocument"`
}

type Scan struct {
	ObjectType    string   `json:"objectType"`
	ScanID        string   `json:"scanID"`
	ProductID     string   `json:"productID"`
	TagID         string   `json:"tagID"`
	TagTechnology string   `json:"tagTechnology"`
	TagSupplierID string   `json:"tagSupplierID"`
	ScanBy        string   `json:"scanBy"`
	Time          string   `json:"time"`
	Location      location `json:"location"`
}

type ProductDetail struct {
	Product      Product      `json:"product"`
	Profile      ProductStyle `json:"ProductStyle"`
	ImageIDs     []string     `json:"imageIDs"`
	ImageStrings []string     `json:"imageStrings"`
}

type productWithImages struct {
	StructName    interface{} `json:"structName"`
	EndodedImages []string    `json:"endodedImages"`
}

type Authenticate struct {
	IsAuthentic bool `json:"isAuthentic"`
}

type Images struct {
	ObjectType  string `json:"objectType"`
	ImageID     string `json:"imageID"`
	ImageType   string `json:"imageType"`
	ImageName   string `json:"imageName"`
	Description string `json:"description"`
	ImageString string `json:"imageString"`
}

type Factory struct {
	ObjectType string   `json:"objectType"`
	FactoryID  string   `json:"factoryID"`
	Location   location `json:"location"`
	BrandIDs   []string `json:"brandIDs"`
}

type Manufacturer struct {
	ObjectType     string   `json:"objectType"`
	ManufacturerID string   `json:"manufacturerID"`
	FactoryIDs     []string `json:"factoryIDs"`
	BrandIDs       []string `json:"brandIDs"`
	Name           string   `json:"name"`
	Location       location `json:"location"`
}

type Retailer struct {
	ObjectType string   `json:"objectType"`
	RetailerID string   `json:"retailerID"`
	Name       string   `json:"name"`
	Location   location `json:"location"`
}

type TagSupplier struct {
	ObjectType     string   `json:"objectType"`
	TagSupplierID  string   `json:"tagSupplierID"`
	Name           string   `json:"name"`
	TagTechnology  []string `json:"tagTechnology"`
	ScanTechnology []string `json:"scanTechnology"`
	FactoryIDs     []string `json:"factoryIDs"`
}

type Tag struct {
	ObjectType    string `json:"objectType"`
	TagID         string `json:"tagID"`
	TagSupplierID string `json:"tagSupplierID"`
	ProductID     string `json:"productID"`
	FactoryID     string `json:"factoryID"`
	BrandID       string `json:"brandID"`
	Status        string `json:"status"`
	Pattern       string `json:"pattern"`
	TagTechnology string `json:"tagTechnology"`
	Hash          string `json:"hash"`
}

type Brand struct {
	ObjectType     string `json:"objectType"`
	BrandID        string `json:"brandID"`
	Name           string `json:"name"`
	Logo           string `json:"logo"`
	ManufacturerID string `json:"manufacturerID"`
	TagTechnology  string `json:"tagTechnology"`
}

type Transaction struct {
	ObjectType    string       `json:"objectType"`
	TransactionID string       `json:"transactionID"`
	RetailerID    string       `json:"retailerID"`
	ProductID     string       `json:"productID"`
	Location      location     `json:"location"`
	Date          string       `json:"date"`
	Registration  registration `json:"registration"`
}

type registration struct {
	TransactionID   string  `json:"transactionID"`
	EmailID         string  `json:"emailID"`
	Username        string  `json:"username"`
	Address         address `json:"address`
	CertificateHash string  `json:"certificateHash"`
}

type location struct {
	LocationID string `json:"locationID"`
	GPS        string `json:"gps"`
	Name       string `json:"name"`
}

type address struct {
	City        string `json:"city"`
	State       string `json:"state"`
	AddressLine string `json:"addressline"`
}
type richQuery struct {
	ObjectType  string       `json:"objectType"`
	QueryFields []queryField `json:"queryField"`
}
type queryField struct {
	FieldName      string `json:"fieldName"`
	FieldValue     string `json:"fieldValue"`
	BoolFieldValue bool   `json:"boolFieldValue"`
	Operator       string `json:"operator"`
}
