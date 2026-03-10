'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Award,
  Check,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react';

// Mock data for fellowships
const mockFellowships = [
  {
    id: 'fellow1',
    nameEn: 'Agricultural Water Management Fellowship',
    nameAr: 'زمالة إدارة المياه الزراعية',
    descriptionEn:
      'Advanced fellowship for specialists in agricultural water management and conservation',
    descriptionAr:
      'زمالة متقدمة للمتخصصين في إدارة المياه الزراعية والحفاظ عليها',
    requirements: [
      {
        id: 'req1',
        nameEn: 'Professional certification for at least 5 years',
        nameAr: 'شهادة مهنية لمدة 5 سنوات على الأقل',
      },
      {
        id: 'req2',
        nameEn: '3 published research papers in peer-reviewed journals',
        nameAr: '3 أوراق بحثية منشورة في مجلات محكمة',
      },
      {
        id: 'req3',
        nameEn: 'Pass specialized examination',
        nameAr: 'اجتياز الامتحان التخصصي',
      },
    ],
    renewalPeriod: 3,
    examRequired: true,
    isActive: true,
    createdAt: '2023-05-15',
    fellows: 12,
  },
  {
    id: 'fellow2',
    nameEn: 'Sustainable Agriculture Fellowship',
    nameAr: 'زمالة الزراعة المستدامة',
    descriptionEn:
      'Fellowship for experts in sustainable and organic farming practices',
    descriptionAr: 'زمالة للخبراء في ممارسات الزراعة المستدامة والعضوية',
    requirements: [
      {
        id: 'req4',
        nameEn: 'Professional certification for at least 5 years',
        nameAr: 'شهادة مهنية لمدة 5 سنوات على الأقل',
      },
      {
        id: 'req5',
        nameEn: '3 published research papers in peer-reviewed journals',
        nameAr: '3 أوراق بحثية منشورة في مجلات محكمة',
      },
      {
        id: 'req6',
        nameEn: 'Documented experience in sustainable agriculture projects',
        nameAr: 'خبرة موثقة في مشاريع الزراعة المستدامة',
      },
      {
        id: 'req7',
        nameEn: 'Pass specialized examination',
        nameAr: 'اجتياز الامتحان التخصصي',
      },
    ],
    renewalPeriod: 3,
    examRequired: true,
    isActive: true,
    createdAt: '2023-06-20',
    fellows: 8,
  },
  {
    id: 'fellow3',
    nameEn: 'Agricultural Engineering Innovation Fellowship',
    nameAr: 'زمالة الابتكار في الهندسة الزراعية',
    descriptionEn:
      'Fellowship for innovators in agricultural engineering technology and solutions',
    descriptionAr: 'زمالة للمبتكرين في تكنولوجيا وحلول الهندسة الزراعية',
    requirements: [
      {
        id: 'req8',
        nameEn: 'Professional certification for at least 5 years',
        nameAr: 'شهادة مهنية لمدة 5 سنوات على الأقل',
      },
      {
        id: 'req9',
        nameEn: '3 published research papers in peer-reviewed journals',
        nameAr: '3 أوراق بحثية منشورة في مجلات محكمة',
      },
      {
        id: 'req10',
        nameEn: 'Registered patent or innovation in agricultural engineering',
        nameAr: 'براءة اختراع أو ابتكار مسجل في الهندسة الزراعية',
      },
      {
        id: 'req11',
        nameEn: 'Pass specialized examination',
        nameAr: 'اجتياز الامتحان التخصصي',
      },
    ],
    renewalPeriod: 3,
    examRequired: true,
    isActive: false,
    createdAt: '2023-08-10',
    fellows: 3,
  },
];

export default function AdminFellowshipsPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [fellowships, setFellowships] = useState(mockFellowships);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentFellowship, setCurrentFellowship] = useState<any>(null);
  const [newRequirement, setNewRequirement] = useState({
    nameEn: '',
    nameAr: '',
  });
  const [activeTab, setActiveTab] = useState('all');

  // Filter fellowships based on search query and active tab
  const filteredFellowships = fellowships.filter(
    (fellowship) =>
      (fellowship.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fellowship.nameAr.includes(searchQuery)) &&
      (activeTab === 'all' ||
        (activeTab === 'active' && fellowship.isActive) ||
        (activeTab === 'inactive' && !fellowship.isActive)),
  );

  const handleAddFellowship = () => {
    const newFellowship = {
      id: `fellow${fellowships.length + 1}`,
      nameEn: currentFellowship.nameEn,
      nameAr: currentFellowship.nameAr,
      descriptionEn: currentFellowship.descriptionEn,
      descriptionAr: currentFellowship.descriptionAr,
      requirements: currentFellowship.requirements || [],
      renewalPeriod: currentFellowship.renewalPeriod,
      examRequired: currentFellowship.examRequired,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      fellows: 0,
    };

    setFellowships([...fellowships, newFellowship]);
    setIsAddDialogOpen(false);
    setCurrentFellowship(null);

    toast({
      title: language === 'en' ? 'Fellowship Added' : 'تمت إضافة الزمالة',
      description:
        language === 'en'
          ? 'The fellowship has been added successfully'
          : 'تمت إضافة الزمالة بنجاح',
    });
  };

  const handleEditFellowship = () => {
    const updatedFellowships = fellowships.map((fellowship) =>
      fellowship.id === currentFellowship.id ? currentFellowship : fellowship,
    );

    setFellowships(updatedFellowships);
    setIsEditDialogOpen(false);
    setCurrentFellowship(null);

    toast({
      title: language === 'en' ? 'Fellowship Updated' : 'تم تحديث الزمالة',
      description:
        language === 'en'
          ? 'The fellowship has been updated successfully'
          : 'تم تحديث الزمالة بنجاح',
    });
  };

  const handleDeleteFellowship = () => {
    const updatedFellowships = fellowships.filter(
      (fellowship) => fellowship.id !== currentFellowship.id,
    );

    setFellowships(updatedFellowships);
    setIsDeleteDialogOpen(false);
    setCurrentFellowship(null);

    toast({
      title: language === 'en' ? 'Fellowship Deleted' : 'تم حذف الزمالة',
      description:
        language === 'en'
          ? 'The fellowship has been deleted successfully'
          : 'تم حذف الزمالة بنجاح',
    });
  };

  const handleToggleStatus = (id: string) => {
    const updatedFellowships = fellowships.map((fellowship) =>
      fellowship.id === id
        ? { ...fellowship, isActive: !fellowship.isActive }
        : fellowship,
    );

    setFellowships(updatedFellowships);

    toast({
      title: language === 'en' ? 'Status Updated' : 'تم تحديث الحالة',
      description:
        language === 'en'
          ? 'The fellowship status has been updated'
          : 'تم تحديث حالة الزمالة',
    });
  };

  const handleAddRequirement = () => {
    if (!newRequirement.nameEn || !newRequirement.nameAr) return;

    const updatedRequirements = [
      ...(currentFellowship.requirements || []),
      {
        id: `req${Date.now()}`,
        nameEn: newRequirement.nameEn,
        nameAr: newRequirement.nameAr,
      },
    ];

    setCurrentFellowship({
      ...currentFellowship,
      requirements: updatedRequirements,
    });

    setNewRequirement({ nameEn: '', nameAr: '' });
  };

  const handleRemoveRequirement = (reqId: string) => {
    const updatedRequirements = currentFellowship.requirements.filter(
      (req: any) => req.id !== reqId,
    );

    setCurrentFellowship({
      ...currentFellowship,
      requirements: updatedRequirements,
    });
  };

  const openAddDialog = () => {
    setCurrentFellowship({
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      requirements: [],
      renewalPeriod: 3,
      examRequired: true,
    });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (fellowship: any) => {
    setCurrentFellowship({ ...fellowship });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (fellowship: any) => {
    setCurrentFellowship(fellowship);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {language === 'en' ? 'Fellowship Management' : 'إدارة الزمالات'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en'
              ? 'Manage specialized fellowships for agricultural engineers'
              : 'إدارة الزمالات المتخصصة للمهندسين الزراعيين'}
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-gradient-green hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          {language === 'en' ? 'Add Fellowship' : 'إضافة زمالة'}
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {language === 'en' ? 'Fellowships' : 'الزمالات'}
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={
                    language === 'en'
                      ? 'Search fellowships...'
                      : 'البحث عن الزمالات...'
                  }
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-[400px]"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">
                    {language === 'en' ? 'All' : 'الكل'}
                  </TabsTrigger>
                  <TabsTrigger value="active">
                    {language === 'en' ? 'Active' : 'نشط'}
                  </TabsTrigger>
                  <TabsTrigger value="inactive">
                    {language === 'en' ? 'Inactive' : 'غير نشط'}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'en' ? 'Name' : 'الاسم'}</TableHead>
                <TableHead>
                  {language === 'en' ? 'Description' : 'الوصف'}
                </TableHead>
                <TableHead>
                  {language === 'en' ? 'Requirements' : 'المتطلبات'}
                </TableHead>
                <TableHead>
                  {language === 'en' ? 'Renewal Period' : 'فترة التجديد'}
                </TableHead>
                <TableHead>
                  {language === 'en' ? 'Fellows' : 'الزملاء'}
                </TableHead>
                <TableHead>{language === 'en' ? 'Status' : 'الحالة'}</TableHead>
                <TableHead className="text-right">
                  {language === 'en' ? 'Actions' : 'الإجراءات'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFellowships.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-muted-foreground"
                  >
                    {language === 'en'
                      ? 'No fellowships found'
                      : 'لم يتم العثور على زمالات'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredFellowships.map((fellowship) => (
                  <TableRow key={fellowship.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        {language === 'en'
                          ? fellowship.nameEn
                          : fellowship.nameAr}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {language === 'en'
                        ? fellowship.descriptionEn
                        : fellowship.descriptionAr}
                    </TableCell>
                    <TableCell>{fellowship.requirements.length}</TableCell>
                    <TableCell>
                      {fellowship.renewalPeriod}{' '}
                      {language === 'en' ? 'years' : 'سنوات'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{fellowship.fellows}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={fellowship.isActive ? 'default' : 'outline'}
                        className={
                          fellowship.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100'
                            : ''
                        }
                      >
                        {fellowship.isActive
                          ? language === 'en'
                            ? 'Active'
                            : 'نشط'
                          : language === 'en'
                            ? 'Inactive'
                            : 'غير نشط'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">
                              {language === 'en' ? 'Actions' : 'الإجراءات'}
                            </span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(fellowship)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {language === 'en' ? 'Edit' : 'تعديل'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(fellowship.id)}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            {fellowship.isActive
                              ? language === 'en'
                                ? 'Set as Inactive'
                                : 'تعيين كغير نشط'
                              : language === 'en'
                                ? 'Set as Active'
                                : 'تعيين كنشط'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => openDeleteDialog(fellowship)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {language === 'en' ? 'Delete' : 'حذف'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Fellowship Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {language === 'en' ? 'Add New Fellowship' : 'إضافة زمالة جديدة'}
            </DialogTitle>
            <DialogDescription>
              {language === 'en'
                ? 'Create a new specialized fellowship for agricultural engineers.'
                : 'إنشاء زمالة متخصصة جديدة للمهندسين الزراعيين.'}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">
                {language === 'en' ? 'General Information' : 'معلومات عامة'}
              </TabsTrigger>
              <TabsTrigger value="requirements">
                {language === 'en' ? 'Requirements' : 'المتطلبات'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameEn">
                    {language === 'en'
                      ? 'Name (English)'
                      : 'الاسم (بالإنجليزية)'}
                  </Label>
                  <Input
                    id="nameEn"
                    value={currentFellowship?.nameEn || ''}
                    onChange={(e) =>
                      setCurrentFellowship({
                        ...currentFellowship,
                        nameEn: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameAr">
                    {language === 'en' ? 'Name (Arabic)' : 'الاسم (بالعربية)'}
                  </Label>
                  <Input
                    id="nameAr"
                    value={currentFellowship?.nameAr || ''}
                    onChange={(e) =>
                      setCurrentFellowship({
                        ...currentFellowship,
                        nameAr: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionEn">
                    {language === 'en'
                      ? 'Description (English)'
                      : 'الوصف (بالإنجليزية)'}
                  </Label>
                  <Textarea
                    id="descriptionEn"
                    value={currentFellowship?.descriptionEn || ''}
                    onChange={(e) =>
                      setCurrentFellowship({
                        ...currentFellowship,
                        descriptionEn: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionAr">
                    {language === 'en'
                      ? 'Description (Arabic)'
                      : 'الوصف (بالعربية)'}
                  </Label>
                  <Textarea
                    id="descriptionAr"
                    value={currentFellowship?.descriptionAr || ''}
                    onChange={(e) =>
                      setCurrentFellowship({
                        ...currentFellowship,
                        descriptionAr: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="renewalPeriod">
                    {language === 'en'
                      ? 'Renewal Period (years)'
                      : 'فترة التجديد (سنوات)'}
                  </Label>
                  <Select
                    value={currentFellowship?.renewalPeriod?.toString() || '3'}
                    onValueChange={(value) =>
                      setCurrentFellowship({
                        ...currentFellowship,
                        renewalPeriod: Number.parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger id="renewalPeriod">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">
                        {language === 'en' ? '1 year' : '1 سنة'}
                      </SelectItem>
                      <SelectItem value="2">
                        {language === 'en' ? '2 years' : '2 سنة'}
                      </SelectItem>
                      <SelectItem value="3">
                        {language === 'en' ? '3 years' : '3 سنوات'}
                      </SelectItem>
                      <SelectItem value="5">
                        {language === 'en' ? '5 years' : '5 سنوات'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    id="examRequired"
                    checked={currentFellowship?.examRequired !== false}
                    onCheckedChange={(checked) =>
                      setCurrentFellowship({
                        ...currentFellowship,
                        examRequired: !!checked,
                      })
                    }
                  />
                  <Label htmlFor="examRequired">
                    {language === 'en'
                      ? 'Specialized Exam Required'
                      : 'مطلوب امتحان متخصص'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    id="isActive"
                    checked={currentFellowship?.isActive !== false}
                    onCheckedChange={(checked) =>
                      setCurrentFellowship({
                        ...currentFellowship,
                        isActive: !!checked,
                      })
                    }
                  />
                  <Label htmlFor="isActive">
                    {language === 'en' ? 'Active Fellowship' : 'زمالة نشطة'}
                  </Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reqNameEn">
                      {language === 'en'
                        ? 'Requirement (English)'
                        : 'المتطلب (بالإنجليزية)'}
                    </Label>
                    <Input
                      id="reqNameEn"
                      value={newRequirement.nameEn}
                      onChange={(e) =>
                        setNewRequirement({
                          ...newRequirement,
                          nameEn: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reqNameAr">
                      {language === 'en'
                        ? 'Requirement (Arabic)'
                        : 'المتطلب (بالعربية)'}
                    </Label>
                    <Input
                      id="reqNameAr"
                      value={newRequirement.nameAr}
                      onChange={(e) =>
                        setNewRequirement({
                          ...newRequirement,
                          nameAr: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddRequirement}
                  disabled={!newRequirement.nameEn || !newRequirement.nameAr}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Add Requirement' : 'إضافة متطلب'}
                </Button>

                <div className="space-y-2">
                  <Label>
                    {language === 'en'
                      ? 'Requirements List'
                      : 'قائمة المتطلبات'}
                  </Label>
                  {currentFellowship?.requirements?.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">
                      {language === 'en'
                        ? 'No requirements added yet'
                        : 'لم تتم إضافة متطلبات بعد'}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {currentFellowship?.requirements?.map((req: any) => (
                        <div
                          key={req.id}
                          className="flex items-center justify-between p-2 border rounded-md bg-muted/50"
                        >
                          <span>
                            {language === 'en' ? req.nameEn : req.nameAr}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRequirement(req.id)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">
                              {language === 'en' ? 'Remove' : 'إزالة'}
                            </span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button
              onClick={handleAddFellowship}
              className="bg-gradient-green hover:opacity-90"
            >
              {language === 'en' ? 'Add Fellowship' : 'إضافة زمالة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Fellowship Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {language === 'en' ? 'Edit Fellowship' : 'تعديل الزمالة'}
            </DialogTitle>
            <DialogDescription>
              {language === 'en'
                ? 'Update the fellowship details and requirements.'
                : 'تحديث تفاصيل ومتطلبات الزمالة.'}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">
                {language === 'en' ? 'General Information' : 'معلومات عامة'}
              </TabsTrigger>
              <TabsTrigger value="requirements">
                {language === 'en' ? 'Requirements' : 'المتطلبات'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nameEn">
                    {language === 'en'
                      ? 'Name (English)'
                      : 'الاسم (بالإنجليزية)'}
                  </Label>
                  <Input
                    id="edit-nameEn"
                    value={currentFellowship?.nameEn || ''}
                    onChange={(e) =>
                      setCurrentFellowship({
                        ...currentFellowship,
                        nameEn: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-nameAr">
                    {language === 'en' ? 'Name (Arabic)' : 'الاسم (بالعربية)'}
                  </Label>
                  <Input
                    id="edit-nameAr"
                    value={currentFellowship?.nameAr || ''}
                    onChange={(e) =>
                      setCurrentFellowship({
                        ...currentFellowship,
                        nameAr: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-descriptionEn">
                    {language === 'en'
                      ? 'Description (English)'
                      : 'الوصف (بالإنجليزية)'}
                  </Label>
                  <Textarea
                    id="edit-descriptionEn"
                    value={currentFellowship?.descriptionEn || ''}
                    onChange={(e) =>
                      setCurrentFellowship({
                        ...currentFellowship,
                        descriptionEn: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-descriptionAr">
                    {language === 'en'
                      ? 'Description (Arabic)'
                      : 'الوصف (بالعربية)'}
                  </Label>
                  <Textarea
                    id="edit-descriptionAr"
                    value={currentFellowship?.descriptionAr || ''}
                    onChange={(e) =>
                      setCurrentFellowship({
                        ...currentFellowship,
                        descriptionAr: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-renewalPeriod">
                    {language === 'en'
                      ? 'Renewal Period (years)'
                      : 'فترة التجديد (سنوات)'}
                  </Label>
                  <Select
                    value={currentFellowship?.renewalPeriod?.toString() || '3'}
                    onValueChange={(value) =>
                      setCurrentFellowship({
                        ...currentFellowship,
                        renewalPeriod: Number.parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger id="edit-renewalPeriod">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">
                        {language === 'en' ? '1 year' : '1 سنة'}
                      </SelectItem>
                      <SelectItem value="2">
                        {language === 'en' ? '2 years' : '2 سنة'}
                      </SelectItem>
                      <SelectItem value="3">
                        {language === 'en' ? '3 years' : '3 سنوات'}
                      </SelectItem>
                      <SelectItem value="5">
                        {language === 'en' ? '5 years' : '5 سنوات'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    id="edit-examRequired"
                    checked={currentFellowship?.examRequired}
                    onCheckedChange={(checked) =>
                      setCurrentFellowship({
                        ...currentFellowship,
                        examRequired: checked,
                      })
                    }
                  />
                  <Label htmlFor="edit-examRequired">
                    {language === 'en'
                      ? 'Specialized Exam Required'
                      : 'مطلوب امتحان متخصص'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    id="edit-isActive"
                    checked={currentFellowship?.isActive}
                    onCheckedChange={(checked) =>
                      setCurrentFellowship({
                        ...currentFellowship,
                        isActive: checked,
                      })
                    }
                  />
                  <Label htmlFor="edit-isActive">
                    {language === 'en' ? 'Active Fellowship' : 'زمالة نشطة'}
                  </Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-reqNameEn">
                      {language === 'en'
                        ? 'Requirement (English)'
                        : 'المتطلب (بالإنجليزية)'}
                    </Label>
                    <Input
                      id="edit-reqNameEn"
                      value={newRequirement.nameEn}
                      onChange={(e) =>
                        setNewRequirement({
                          ...newRequirement,
                          nameEn: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-reqNameAr">
                      {language === 'en'
                        ? 'Requirement (Arabic)'
                        : 'المتطلب (بالعربية)'}
                    </Label>
                    <Input
                      id="edit-reqNameAr"
                      value={newRequirement.nameAr}
                      onChange={(e) =>
                        setNewRequirement({
                          ...newRequirement,
                          nameAr: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddRequirement}
                  disabled={!newRequirement.nameEn || !newRequirement.nameAr}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Add Requirement' : 'إضافة متطلب'}
                </Button>

                <div className="space-y-2">
                  <Label>
                    {language === 'en'
                      ? 'Requirements List'
                      : 'قائمة المتطلبات'}
                  </Label>
                  {currentFellowship?.requirements?.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">
                      {language === 'en'
                        ? 'No requirements added yet'
                        : 'لم تتم إضافة متطلبات بعد'}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {currentFellowship?.requirements?.map((req: any) => (
                        <div
                          key={req.id}
                          className="flex items-center justify-between p-2 border rounded-md bg-muted/50"
                        >
                          <span>
                            {language === 'en' ? req.nameEn : req.nameAr}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRequirement(req.id)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">
                              {language === 'en' ? 'Remove' : 'إزالة'}
                            </span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button
              onClick={handleEditFellowship}
              className="bg-gradient-green hover:opacity-90"
            >
              {language === 'en' ? 'Save Changes' : 'حفظ التغييرات'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'en' ? 'Delete Fellowship' : 'حذف الزمالة'}
            </DialogTitle>
            <DialogDescription>
              {language === 'en'
                ? 'Are you sure you want to delete this fellowship? This action cannot be undone.'
                : 'هل أنت متأكد من رغبتك في حذف هذه الزمالة؟ لا يمكن التراجع عن هذا الإجراء.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button variant="destructive" onClick={handleDeleteFellowship}>
              {language === 'en' ? 'Delete' : 'حذف'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
