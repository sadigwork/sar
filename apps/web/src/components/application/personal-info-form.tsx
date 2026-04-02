'use client';

// import type React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PersonalInfoFormProps {
  data: {
    fullName: string;
    fullNameEn: string;
    nationalId: string;
    birthDate: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phoneNumber: string;
    email: string;
    specialization: string;
    graduationYear: string;
    university: string;
  };
  updateData: (data: any) => void;
  onSubmit?: () => void;
}

export function PersonalInfoForm({
  data,
  updateData,
  onSubmit,
}: PersonalInfoFormProps) {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    updateData({
      ...data,
      [e.target.name]: e.target.value,
    });
    // إزالة الخطأ عند التغيير
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    updateData({
      ...data,
      [name]: value,
    });
    // إزالة الخطأ عند التغيير
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.fullName.trim())
      newErrors.fullName =
        t('language') === 'en'
          ? 'Full Name (Arabic) is required'
          : 'الاسم الكامل (عربي) مطلوب';
    if (!data.fullNameEn.trim())
      newErrors.fullNameEn =
        t('language') === 'en'
          ? 'Full Name (English) is required'
          : 'الاسم الكامل (إنجليزي) مطلوب';
    if (!data.nationalId.trim())
      newErrors.nationalId =
        t('language') === 'en'
          ? 'National ID is required'
          : 'رقم الهوية الوطنية مطلوب';
    if (!data.specialization.trim())
      newErrors.specialization =
        t('language') === 'en' ? 'Specialization is required' : 'التخصص مطلوب';

    const graduationYearValue =
      data.graduationYear !== undefined && data.graduationYear !== null
        ? String(data.graduationYear).trim()
        : '';
    if (!graduationYearValue)
      newErrors.graduationYear =
        t('language') === 'en'
          ? 'Graduation Year is required'
          : 'سنة التخرج مطلوبة';
    if (!data.university.trim())
      newErrors.university =
        t('language') === 'en' ? 'University is required' : 'الجامعة مطلوبة';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && onSubmit) {
      onSubmit(); // استدعاء الإرسال إذا كان صحيحاً
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">
            {t('language') === 'en'
              ? 'Full Name (Arabic)'
              : 'الاسم الكامل (عربي)'}
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={data?.fullName ?? ''}
            onChange={handleChange}
            placeholder={
              t('language') === 'en'
                ? 'Enter your full name in Arabic'
                : 'أدخل اسمك الكامل بالعربية'
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullNameEn">
            {t('language') === 'en'
              ? 'Full Name (English)'
              : 'الاسم الكامل (إنجليزي)'}
          </Label>
          <Input
            id="fullNameEn"
            name="fullNameEn"
            value={data?.fullNameEn ?? ''}
            onChange={handleChange}
            placeholder={
              t('language') === 'en'
                ? 'Enter your full name in English'
                : 'أدخل اسمك الكامل بالإنجليزية'
            }
            required
          />
          {errors.fullNameEn && (
            <p className="text-red-500 text-sm">{errors.fullNameEn}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="nationalId">
          {t('language') === 'en' ? 'National ID' : 'رقم الهوية الوطنية'}
        </Label>
        <Input
          id="nationalId"
          name="nationalId"
          value={data?.nationalId ?? ''}
          onChange={handleChange}
          placeholder={
            t('language') === 'en'
              ? 'Enter your national ID'
              : 'أدخل رقم الهوية الوطنية'
          }
          required
        />
        {errors.nationalId && (
          <p className="text-red-500 text-sm">{errors.nationalId}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthDate">
            {t('language') === 'en' ? 'Date of Birth' : 'تاريخ الميلاد'}
          </Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={data?.birthDate ?? ''}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">
            {t('language') === 'en' ? 'Phone Number' : 'رقم الهاتف'}
          </Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={data?.phoneNumber ?? ''}
            onChange={handleChange}
            placeholder={
              t('language') === 'en'
                ? 'Enter your phone number'
                : 'أدخل رقم هاتفك'
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          {t('language') === 'en' ? 'Email' : 'البريد الإلكتروني'}
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={data?.email ?? ''}
          onChange={handleChange}
          placeholder={
            t('language') === 'en'
              ? 'Enter your email'
              : 'أدخل بريدك الإلكتروني'
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="specialization">
            {t('language') === 'en' ? 'Specialization' : 'التخصص'}
          </Label>
          <Input
            id="specialization"
            name="specialization"
            value={data?.specialization ?? ''}
            onChange={handleChange}
            placeholder={
              t('language') === 'en'
                ? 'Enter your specialization'
                : 'أدخل تخصصك'
            }
            required
          />
          {errors.specialization && (
            <p className="text-red-500 text-sm">{errors.specialization}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="graduationYear">
            {t('language') === 'en' ? 'Graduation Year' : 'سنة التخرج'}
          </Label>
          <Input
            id="graduationYear"
            name="graduationYear"
            type="number"
            value={data?.graduationYear ?? ''}
            onChange={handleChange}
            placeholder={
              t('language') === 'en'
                ? 'Enter graduation year'
                : 'أدخل سنة التخرج'
            }
            required
          />
          {errors.graduationYear && (
            <p className="text-red-500 text-sm">{errors.graduationYear}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="university">
          {t('language') === 'en' ? 'University' : 'الجامعة'}
        </Label>
        <Input
          id="university"
          name="university"
          value={data?.university ?? ''}
          onChange={handleChange}
          placeholder={
            t('language') === 'en' ? 'Enter your university' : 'أدخل جامعك'
          }
          required
        />
        {errors.university && (
          <p className="text-red-500 text-sm">{errors.university}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">
            {t('language') === 'en' ? 'City' : 'المدينة'}
          </Label>
          <Input
            id="city"
            name="city"
            value={data.city}
            onChange={handleChange}
            placeholder={
              t('language') === 'en' ? 'Enter your city' : 'أدخل مدينتك'
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">
            {t('language') === 'en' ? 'Country' : 'الدولة'}
          </Label>
          <Select
            value={data.country}
            onValueChange={(value) => handleSelectChange('country', value)}
          >
            <SelectTrigger id="country">
              <SelectValue
                placeholder={
                  t('language') === 'en' ? 'Select country' : 'اختر الدولة'
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sudan">
                {t('language') === 'en' ? 'Sudan' : 'السودان'}
              </SelectItem>
              <SelectItem value="saudi_arabia">
                {t('language') === 'en'
                  ? 'Saudi Arabia'
                  : 'المملكة العربية السعودية'}
              </SelectItem>
              <SelectItem value="egypt">
                {t('language') === 'en' ? 'Egypt' : 'مصر'}
              </SelectItem>
              <SelectItem value="uae">
                {t('language') === 'en'
                  ? 'United Arab Emirates'
                  : 'الإمارات العربية المتحدة'}
              </SelectItem>
              <SelectItem value="kuwait">
                {t('language') === 'en' ? 'Kuwait' : 'الكويت'}
              </SelectItem>
              <SelectItem value="bahrain">
                {t('language') === 'en' ? 'Bahrain' : 'البحرين'}
              </SelectItem>
              <SelectItem value="qatar">
                {t('language') === 'en' ? 'Qatar' : 'قطر'}
              </SelectItem>
              <SelectItem value="oman">
                {t('language') === 'en' ? 'Oman' : 'عمان'}
              </SelectItem>
              <SelectItem value="jordan">
                {t('language') === 'en' ? 'Jordan' : 'الأردن'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">
            {t('language') === 'en' ? 'Postal Code' : 'الرمز البريدي'}
          </Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={data.postalCode}
            onChange={handleChange}
            placeholder={
              t('language') === 'en'
                ? 'Enter postal code'
                : 'أدخل الرمز البريدي'
            }
          />
        </div>
      </div>
    </form>
  );
}
