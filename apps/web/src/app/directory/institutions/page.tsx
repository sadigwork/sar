"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Globe, Calendar, Award, Users, Building2, Filter } from "lucide-react"

// Mock data for institutions
const mockInstitutions = [
  // Universities
  {
    id: "uni1",
    type: "university",
    nameEn: "Agricultural Sciences University",
    nameAr: "جامعة العلوم الزراعية",
    descriptionEn: "Leading university in agricultural sciences and engineering",
    descriptionAr: "جامعة رائدة في العلوم الزراعية والهندسة",
    location: "Riyadh, Saudi Arabia",
    locationAr: "الرياض، المملكة العربية السعودية",
    website: "https://www.asu-example.edu",
    rating: 5,
    programs: 12,
    established: 1985,
    accredited: true,
  },
  {
    id: "uni2",
    type: "university",
    nameEn: "Cairo Agricultural College",
    nameAr: "كلية القاهرة الزراعية",
    descriptionEn: "Specialized college for agricultural engineering and sciences",
    descriptionAr: "كلية متخصصة في الهندسة الزراعية والعلوم",
    location: "Cairo, Egypt",
    locationAr: "القاهرة، مصر",
    website: "https://www.cac-example.edu",
    rating: 4,
    programs: 8,
    established: 1990,
    accredited: true,
  },
  {
    id: "uni3",
    type: "university",
    nameEn: "Gulf Institute of Agricultural Engineering",
    nameAr: "معهد الخليج للهندسة الزراعية",
    descriptionEn: "Research-focused institute for advanced agricultural engineering",
    descriptionAr: "معهد بحثي متخصص في الهندسة الزراعية المتقدمة",
    location: "Dubai, UAE",
    locationAr: "دبي، الإمارات العربية المتحدة",
    website: "https://www.giae-example.edu",
    rating: 4,
    programs: 5,
    established: 2005,
    accredited: true,
  },

  // Companies
  {
    id: "com1",
    type: "company",
    nameEn: "Green Tech Solutions",
    nameAr: "حلول التقنية الخضراء",
    descriptionEn: "Innovative agricultural technology and engineering solutions",
    descriptionAr: "حلول مبتكرة في التكنولوجيا الزراعية والهندسة",
    location: "Jeddah, Saudi Arabia",
    locationAr: "جدة، المملكة العربية السعودية",
    website: "https://www.greentech-example.com",
    rating: 5,
    engineers: 45,
    established: 2010,
    sector: "Agricultural Technology",
    sectorAr: "التكنولوجيا الزراعية",
    complianceScore: 95,
  },
  {
    id: "com2",
    type: "company",
    nameEn: "Desert Irrigation Systems",
    nameAr: "أنظمة الري الصحراوية",
    descriptionEn: "Specialized in water management and irrigation engineering",
    descriptionAr: "متخصصة في إدارة المياه وهندسة الري",
    location: "Abu Dhabi, UAE",
    locationAr: "أبو ظبي، الإمارات العربية المتحدة",
    website: "https://www.desertirr-example.com",
    rating: 4,
    engineers: 28,
    established: 2008,
    sector: "Irrigation Systems",
    sectorAr: "أنظمة الري",
    complianceScore: 88,
  },
  {
    id: "com3",
    type: "company",
    nameEn: "Agricultural Machinery Innovations",
    nameAr: "ابتكارات الآلات الزراعية",
    descriptionEn: "Leading manufacturer of agricultural machinery and equipment",
    descriptionAr: "شركة رائدة في تصنيع الآلات والمعدات الزراعية",
    location: "Amman, Jordan",
    locationAr: "عمان، الأردن",
    website: "https://www.agrimach-example.com",
    rating: 3,
    engineers: 35,
    established: 2012,
    sector: "Agricultural Machinery",
    sectorAr: "الآلات الزراعية",
    complianceScore: 75,
  },
]

export default function InstitutionsDirectoryPage() {
  const { t, language } = useLanguage()
  const [institutionType, setInstitutionType] = useState<"all" | "university" | "company">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  // Filter institutions based on search query, type, and country
  const filteredInstitutions = mockInstitutions.filter(
    (institution) =>
      (institutionType === "all" || institution.type === institutionType) &&
      (countryFilter === "all" || institution.location.toLowerCase().includes(countryFilter)) &&
      (institution.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        institution.nameAr.includes(searchQuery) ||
        institution.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        institution.descriptionAr.includes(searchQuery)),
  )

  // Sort institutions
  const sortedInstitutions = [...filteredInstitutions].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating
    } else if (sortBy === "name") {
      return language === "en" ? a.nameEn.localeCompare(b.nameEn) : a.nameAr.localeCompare(b.nameAr)
    } else if (sortBy === "established") {
      return a.established - b.established
    }
    return 0
  })

  const getRatingStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
      ))
  }

  // Extract unique countries for filter
  const countries = Array.from(
    new Set(
      mockInstitutions.map((inst) => {
        const locationParts = inst.location.split(", ")
        return locationParts[locationParts.length - 1]
      }),
    ),
  )

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">
          {language === "en" ? "Accredited Institutions Directory" : "دليل المؤسسات المعتمدة"}
        </h1>
        <p className="text-muted-foreground">
          {language === "en"
            ? "Browse our directory of accredited universities, colleges, and agricultural companies"
            : "تصفح دليل الجامعات والكليات والشركات الزراعية المعتمدة"}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-muted p-4 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/3">
            <Input
              placeholder={language === "en" ? "Search institutions..." : "البحث عن مؤسسات..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="w-full md:w-1/6">
            <Select value={institutionType} onValueChange={(value: any) => setInstitutionType(value)}>
              <SelectTrigger>
                <SelectValue placeholder={language === "en" ? "Type" : "النوع"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "en" ? "All Types" : "جميع الأنواع"}</SelectItem>
                <SelectItem value="university">{language === "en" ? "Universities" : "الجامعات"}</SelectItem>
                <SelectItem value="company">{language === "en" ? "Companies" : "الشركات"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/6">
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={language === "en" ? "Country" : "الدولة"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "en" ? "All Countries" : "جميع الدول"}</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country.toLowerCase()}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/6">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder={language === "en" ? "Sort by" : "ترتيب حسب"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">{language === "en" ? "Rating" : "التقييم"}</SelectItem>
                <SelectItem value="name">{language === "en" ? "Name" : "الاسم"}</SelectItem>
                <SelectItem value="established">{language === "en" ? "Established Date" : "تاريخ التأسيس"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedInstitutions.map((institution) => (
          <Card key={institution.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{language === "en" ? institution.nameEn : institution.nameAr}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {language === "en" ? institution.location : institution.locationAr}
                  </CardDescription>
                </div>
                <Badge variant={institution.type === "university" ? "default" : "outline"}>
                  {language === "en"
                    ? institution.type === "university"
                      ? "University"
                      : "Company"
                    : institution.type === "university"
                      ? "جامعة"
                      : "شركة"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                {language === "en" ? institution.descriptionEn : institution.descriptionAr}
              </p>

              <div className="flex items-center mb-2">
                <div className="flex mr-2">{getRatingStars(institution.rating)}</div>
                <span className="text-sm text-muted-foreground">{institution.rating}/5</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>
                    {language === "en" ? "Est. " : "تأسست "}
                    {institution.established}
                  </span>
                </div>

                {institution.type === "university" ? (
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>
                      {language === "en" ? `${institution.programs} Programs` : `${institution.programs} برنامج`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>
                      {language === "en" ? `${institution.engineers} Engineers` : `${institution.engineers} مهندس`}
                    </span>
                  </div>
                )}

                {institution.type === "university" && (
                  <div className="flex items-center col-span-2">
                    <Building2 className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>
                      {language === "en"
                        ? institution.accredited
                          ? "Accredited"
                          : "Not Accredited"
                        : institution.accredited
                          ? "معتمدة"
                          : "غير معتمدة"}
                    </span>
                  </div>
                )}

                {institution.type === "company" && (
                  <div className="flex items-center col-span-2">
                    <Filter className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>
                      {language === "en"
                        ? `${institution.sector} - Compliance: ${institution.complianceScore}%`
                        : `${institution.sectorAr} - الامتثال: ${institution.complianceScore}%`}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => window.open(institution.website, "_blank")}>
                <Globe className="h-4 w-4 mr-2" />
                {language === "en" ? "Visit Website" : "زيارة الموقع"}
              </Button>
              <Button size="sm">{language === "en" ? "View Details" : "عرض التفاصيل"}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {sortedInstitutions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {language === "en"
              ? "No institutions found matching your criteria"
              : "لم يتم العثور على مؤسسات تطابق معايير البحث"}
          </p>
        </div>
      )}
    </div>
  )
}
