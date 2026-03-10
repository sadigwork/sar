'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface CertificationCriteria {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  weight: number;
  description: string;
  descriptionAr: string;
}

export default function CertificationCriteriaPage() {
  const { t, language } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [criteria, setCriteria] = useState<CertificationCriteria[]>([
    {
      id: '1',
      name: 'Academic Degree',
      nameAr: 'الدرجة العلمية',
      category: 'education',
      weight: 25,
      description: 'Weight given to the highest academic degree achieved',
      descriptionAr: 'الوزن المعطى لأعلى درجة علمية تم تحقيقها',
    },
    {
      id: '2',
      name: 'Years of Experience',
      nameAr: 'سنوات الخبرة',
      category: 'experience',
      weight: 35,
      description: 'Weight given to the total years of professional experience',
      descriptionAr: 'الوزن المعطى لإجمالي سنوات الخبرة المهنية',
    },
    {
      id: '3',
      name: 'Training Courses',
      nameAr: 'الدورات التدريبية',
      category: 'training',
      weight: 15,
      description:
        'Weight given to relevant training courses and certifications',
      descriptionAr: 'الوزن المعطى للدورات التدريبية والشهادات ذات الصلة',
    },
    {
      id: '4',
      name: 'Research Publications',
      nameAr: 'المنشورات البحثية',
      category: 'research',
      weight: 10,
      description: 'Weight given to research papers and publications',
      descriptionAr: 'الوزن المعطى للأوراق البحثية والمنشورات',
    },
    {
      id: '5',
      name: 'Professional Projects',
      nameAr: 'المشاريع المهنية',
      category: 'projects',
      weight: 15,
      description:
        'Weight given to significant professional projects completed',
      descriptionAr: 'الوزن المعطى للمشاريع المهنية المهمة المكتملة',
    },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] =
    useState<CertificationCriteria | null>(null);
  const [formData, setFormData] = useState<CertificationCriteria>({
    id: '',
    name: '',
    nameAr: '',
    category: '',
    weight: 0,
    description: '',
    descriptionAr: '',
  });

  // Check if user is logged in and is an admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/dashboard');
      } else {
        setIsLoading(false);
      }
    }
  }, [user, authLoading, router]);

  const handleAddCriteria = () => {
    setEditingCriteria(null);
    setFormData({
      id: Date.now().toString(),
      name: '',
      nameAr: '',
      category: '',
      weight: 10,
      description: '',
      descriptionAr: '',
    });
    setDialogOpen(true);
  };

  const handleEditCriteria = (criteria: CertificationCriteria) => {
    setEditingCriteria(criteria);
    setFormData({ ...criteria });
    setDialogOpen(true);
  };

  const handleDeleteCriteria = (id: string) => {
    setCriteria(criteria.filter((c) => c.id !== id));
    toast({
      title: t('language') === 'en' ? 'Criteria Deleted' : 'تم حذف المعيار',
      description:
        t('language') === 'en'
          ? 'The certification criteria has been deleted successfully'
          : 'تم حذف معيار الشهادة بنجاح',
    });
  };

  const handleSaveCriteria = () => {
    if (editingCriteria) {
      // Update existing criteria
      setCriteria(
        criteria.map((c) => (c.id === editingCriteria.id ? formData : c)),
      );
      toast({
        title: t('language') === 'en' ? 'Criteria Updated' : 'تم تحديث المعيار',
        description:
          t('language') === 'en'
            ? 'The certification criteria has been updated successfully'
            : 'تم تحديث معيار الشهادة بنجاح',
      });
    } else {
      // Add new criteria
      setCriteria([...criteria, formData]);
      toast({
        title: t('language') === 'en' ? 'Criteria Added' : 'تمت إضافة المعيار',
        description:
          t('language') === 'en'
            ? 'The certification criteria has been added successfully'
            : 'تمت إضافة معيار الشهادة بنجاح',
      });
    }
    setDialogOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'weight' ? Number.parseInt(value) : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSliderChange = (value: number[]) => {
    setFormData({
      ...formData,
      weight: value[0],
    });
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'education':
        return t('language') === 'en' ? 'Education' : 'التعليم';
      case 'experience':
        return t('language') === 'en' ? 'Experience' : 'الخبرة';
      case 'training':
        return t('language') === 'en' ? 'Training' : 'التدريب';
      case 'research':
        return t('language') === 'en' ? 'Research' : 'البحث';
      case 'projects':
        return t('language') === 'en' ? 'Projects' : 'المشاريع';
      default:
        return category;
    }
  };

  // Calculate total weight
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{t('language') === 'en' ? 'Loading...' : 'جاري التحميل...'}</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t('language') === 'en'
              ? 'Certification Criteria'
              : 'معايير الشهادات'}
          </h1>
          <p className="text-muted-foreground">
            {t('language') === 'en'
              ? 'Manage certification criteria and weights for evaluation'
              : 'إدارة معايير الشهادات وأوزانها للتقييم'}
          </p>
        </div>
        <Button
          onClick={handleAddCriteria}
          className="bg-gradient-green hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('language') === 'en' ? 'Add Criteria' : 'إضافة معيار'}
        </Button>
      </div>

      <Card className="bg-card mb-6">
        <CardHeader>
          <CardTitle>
            {t('language') === 'en' ? 'Weight Distribution' : 'توزيع الأوزان'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {t('language') === 'en' ? 'Total Weight' : 'إجمالي الوزن'}:{' '}
              {totalWeight}%
            </span>
            <span
              className={`text-sm font-medium ${
                totalWeight === 100
                  ? 'text-green-500'
                  : totalWeight < 100
                    ? 'text-yellow-500'
                    : 'text-red-500'
              }`}
            >
              {totalWeight === 100
                ? t('language') === 'en'
                  ? 'Balanced'
                  : 'متوازن'
                : totalWeight < 100
                  ? t('language') === 'en'
                    ? `${100 - totalWeight}% Remaining`
                    : `${100 - totalWeight}% متبقي`
                  : t('language') === 'en'
                    ? `${totalWeight - 100}% Excess`
                    : `${totalWeight - 100}% زائد`}
            </span>
          </div>
          <div className="w-full h-4 bg-secondary rounded-full overflow-hidden">
            {criteria.map((c, index) => {
              // Calculate the cumulative percentage up to this criteria
              const previousWidth = criteria
                .slice(0, index)
                .reduce((sum, prev) => sum + (prev.weight / 100) * 100, 0);

              // Get a color based on the category
              const getColor = (category: string) => {
                switch (category) {
                  case 'education':
                    return 'bg-blue-500';
                  case 'experience':
                    return 'bg-green-500';
                  case 'training':
                    return 'bg-yellow-500';
                  case 'research':
                    return 'bg-purple-500';
                  case 'projects':
                    return 'bg-pink-500';
                  default:
                    return 'bg-gray-500';
                }
              };

              return (
                <div
                  key={c.id}
                  className={`h-full float-left ${getColor(c.category)}`}
                  style={{
                    width: `${(c.weight / 100) * 100}%`,
                    marginLeft: index === 0 ? '0' : undefined,
                  }}
                  title={`${language === 'en' ? c.name : c.nameAr}: ${c.weight}%`}
                />
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {criteria.map((c) => (
              <div key={c.id} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    c.category === 'education'
                      ? 'bg-blue-500'
                      : c.category === 'experience'
                        ? 'bg-green-500'
                        : c.category === 'training'
                          ? 'bg-yellow-500'
                          : c.category === 'research'
                            ? 'bg-purple-500'
                            : 'bg-pink-500'
                  }`}
                />
                <span className="text-sm">
                  {language === 'en' ? c.name : c.nameAr}: {c.weight}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>
            {t('language') === 'en'
              ? 'Certification Criteria'
              : 'معايير الشهادات'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {t('language') === 'en' ? 'Criteria Name' : 'اسم المعيار'}
                </TableHead>
                <TableHead>
                  {t('language') === 'en' ? 'Category' : 'الفئة'}
                </TableHead>
                <TableHead>
                  {t('language') === 'en' ? 'Weight' : 'الوزن'}
                </TableHead>
                <TableHead>
                  {t('language') === 'en' ? 'Description' : 'الوصف'}
                </TableHead>
                <TableHead className="text-right">
                  {t('language') === 'en' ? 'Actions' : 'الإجراءات'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {criteria.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    {language === 'en' ? c.name : c.nameAr}
                  </TableCell>
                  <TableCell>{getCategoryLabel(c.category)}</TableCell>
                  <TableCell>{c.weight}%</TableCell>
                  <TableCell className="max-w-md truncate">
                    {language === 'en' ? c.description : c.descriptionAr}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCriteria(c)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">
                          {t('language') === 'en' ? 'Edit' : 'تعديل'}
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCriteria(c.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">
                          {t('language') === 'en' ? 'Delete' : 'حذف'}
                        </span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCriteria
                ? t('language') === 'en'
                  ? 'Edit Certification Criteria'
                  : 'تعديل معيار الشهادة'
                : t('language') === 'en'
                  ? 'Add Certification Criteria'
                  : 'إضافة معيار شهادة'}
            </DialogTitle>
            <DialogDescription>
              {t('language') === 'en'
                ? 'Define the criteria and weight for certification evaluation'
                : 'تحديد المعايير والوزن لتقييم الشهادة'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('language') === 'en'
                    ? 'Criteria Name (English)'
                    : 'اسم المعيار (بالإنجليزية)'}
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={
                    t('language') === 'en'
                      ? 'e.g. Academic Degree'
                      : 'مثال: Academic Degree'
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameAr">
                  {t('language') === 'en'
                    ? 'Criteria Name (Arabic)'
                    : 'اسم المعيار (بالعربية)'}
                </Label>
                <Input
                  id="nameAr"
                  name="nameAr"
                  value={formData.nameAr}
                  onChange={handleChange}
                  placeholder={
                    t('language') === 'en'
                      ? 'e.g. الدرجة العلمية'
                      : 'مثال: الدرجة العلمية'
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">
                {t('language') === 'en' ? 'Category' : 'الفئة'}
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue
                    placeholder={
                      t('language') === 'en' ? 'Select category' : 'اختر الفئة'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">
                    {t('language') === 'en' ? 'Education' : 'التعليم'}
                  </SelectItem>
                  <SelectItem value="experience">
                    {t('language') === 'en' ? 'Experience' : 'الخبرة'}
                  </SelectItem>
                  <SelectItem value="training">
                    {t('language') === 'en' ? 'Training' : 'التدريب'}
                  </SelectItem>
                  <SelectItem value="research">
                    {t('language') === 'en' ? 'Research' : 'البحث'}
                  </SelectItem>
                  <SelectItem value="projects">
                    {t('language') === 'en' ? 'Projects' : 'المشاريع'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="weight">
                  {t('language') === 'en' ? 'Weight (%)' : 'الوزن (%)'}
                </Label>
                <span className="text-sm font-medium">{formData.weight}%</span>
              </div>
              <Slider
                id="weight"
                min={0}
                max={100}
                step={5}
                value={[formData.weight]}
                onValueChange={handleSliderChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">
                {t('language') === 'en'
                  ? 'Description (English)'
                  : 'الوصف (بالإنجليزية)'}
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={
                  t('language') === 'en'
                    ? 'e.g. Weight given to the highest academic degree achieved'
                    : 'مثال: Weight given to the highest academic degree achieved'
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionAr">
                {t('language') === 'en'
                  ? 'Description (Arabic)'
                  : 'الوصف (بالعربية)'}
              </Label>
              <Input
                id="descriptionAr"
                name="descriptionAr"
                value={formData.descriptionAr}
                onChange={handleChange}
                placeholder={
                  t('language') === 'en'
                    ? 'e.g. الوزن المعطى لأعلى درجة علمية تم تحقيقها'
                    : 'مثال: الوزن المعطى لأعلى درجة علمية تم تحقيقها'
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t('language') === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button
              onClick={handleSaveCriteria}
              className="bg-gradient-green hover:opacity-90"
            >
              <Save className="mr-2 h-4 w-4" />
              {t('language') === 'en' ? 'Save' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
