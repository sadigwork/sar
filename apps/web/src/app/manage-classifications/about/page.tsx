"use client"

import { useLanguage } from "@/components/language-provider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, BookOpen, Building, CheckCircle, FileText, Users } from "lucide-react"

export default function AboutPage() {
  const { language, direction, t } = useLanguage()

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t("aboutTitle")}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("aboutDescription")}</p>
      </div>

      <div className="grid gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>{t("mission")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t("missionContent")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("vision")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t("visionContent")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">{t("values")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("integrity")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t("integrityDesc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("excellence")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t("excellenceDesc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("innovation")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t("innovationDesc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("collaboration")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t("collaborationDesc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("accountability")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t("accountabilityDesc")}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">{t("services")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>{t("engineerClassification")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{t("engineerClassificationDesc")}</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>{t("professionalCertification")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{t("professionalCertificationDesc")}</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <CheckCircle className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>{t("fellowshipPrograms")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{t("fellowshipProgramsDesc")}</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <Building className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>{t("institutionDirectory")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{t("institutionDirectoryDesc")}</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>{t("continuingEducation")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{t("continuingEducationDesc")}</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>{t("publications")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{t("publicationsDesc")}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">{t("faq")}</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left">{t("faqQuestion1")}</AccordionTrigger>
            <AccordionContent>
              <p>{t("faqAnswer1")}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left">{t("faqQuestion2")}</AccordionTrigger>
            <AccordionContent>
              <p>{t("faqAnswer2")}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">{t("faqQuestion3")}</AccordionTrigger>
            <AccordionContent>
              <p>{t("faqAnswer3")}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left">{t("faqQuestion4")}</AccordionTrigger>
            <AccordionContent>
              <p>{t("faqAnswer4")}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left">{t("faqQuestion5")}</AccordionTrigger>
            <AccordionContent>
              <p>{t("faqAnswer5")}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="mb-12">
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">{t("history")}</TabsTrigger>
            <TabsTrigger value="contact">{t("contact")}</TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <Card>
              <CardContent className="pt-6">
                <p>{t("historyContent")}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="contact">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t("email")}:</span>
                    <a href="mailto:info@engineeringclassification.org" className="text-primary hover:underline">
                      info@engineeringclassification.org
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t("phone")}:</span>
                    <a href="tel:+15551234567" className="text-primary hover:underline">
                      +1 (555) 123-4567
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t("address")}:</span>
                    <span>123 Engineering Avenue, Tech City, TC 12345</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
