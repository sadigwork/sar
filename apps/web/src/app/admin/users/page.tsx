'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/language-provider';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  UserPlus,
  UserCog,
  UserX,
  MoreHorizontal,
  UserCheck,
  Shield,
  User,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

export default function AdminUsersPage() {
  const { t } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('user');
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'user',
  });

  // Get role from URL if present
  const roleParam = searchParams.get('role');
  const [activeTab, setActiveTab] = useState(roleParam || 'all');

  // Sample data
  const users = [
    {
      id: 1,
      name: t('language') === 'en' ? 'Ahmed Mohamed' : 'أحمد محمد',
      email: 'ahmed@example.com',
      role: 'user',
      status: 'active',
      avatar: 'AM',
    },
    {
      id: 2,
      name: t('language') === 'en' ? 'Sara Ali' : 'سارة علي',
      email: 'sara@example.com',
      role: 'user',
      status: 'active',
      avatar: 'SA',
    },
    {
      id: 3,
      name: t('language') === 'en' ? 'Khaled Ibrahim' : 'خالد إبراهيم',
      email: 'khaled@example.com',
      role: 'reviewer',
      status: 'active',
      avatar: 'KI',
    },
    {
      id: 4,
      name: t('language') === 'en' ? 'Fatima Hassan' : 'فاطمة حسن',
      email: 'fatima@example.com',
      role: 'reviewer',
      status: 'active',
      avatar: 'FH',
    },
    {
      id: 5,
      name: t('language') === 'en' ? 'Omar Mahmoud' : 'عمر محمود',
      email: 'omar@example.com',
      role: 'admin',
      status: 'active',
      avatar: 'OM',
    },
  ];

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

  const handleAddUser = () => {
    // This would be an API call in a real app
    toast({
      title: t('language') === 'en' ? 'User Added' : 'تمت إضافة المستخدم',
      description:
        t('language') === 'en'
          ? 'The user has been added successfully'
          : 'تمت إضافة المستخدم بنجاح',
    });
    setDialogOpen(false);
    setNewUserData({
      name: '',
      email: '',
      role: 'user',
    });
  };

  const handleChangeRole = (userId: number, newRole: string) => {
    // This would be an API call in a real app
    toast({
      title: t('language') === 'en' ? 'Role Updated' : 'تم تحديث الدور',
      description:
        t('language') === 'en'
          ? 'The user role has been updated'
          : 'تم تحديث دور المستخدم',
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-primary" />;
      case 'reviewer':
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return t('language') === 'en' ? 'Administrator' : 'مدير';
      case 'reviewer':
        return t('language') === 'en' ? 'Reviewer' : 'مراجع';
      default:
        return t('language') === 'en' ? 'User' : 'مستخدم';
    }
  };

  const filteredUsers = (role: string) => {
    return users.filter(
      (u) =>
        (role === 'all' || u.role === role) &&
        (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())),
    );
  };

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
            {t('language') === 'en' ? 'User Management' : 'إدارة المستخدمين'}
          </h1>
          <p className="text-muted-foreground">
            {t('language') === 'en'
              ? 'Manage system users and their roles'
              : 'إدارة مستخدمي النظام وأدوارهم'}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          {t('language') === 'en' ? 'Add User' : 'إضافة مستخدم'}
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={
              t('language') === 'en'
                ? 'Search users...'
                : 'البحث عن مستخدمين...'
            }
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            {t('language') === 'en' ? 'All Users' : 'جميع المستخدمين'}
          </TabsTrigger>
          <TabsTrigger value="user">
            {t('language') === 'en' ? 'Users' : 'المستخدمين'}
          </TabsTrigger>
          <TabsTrigger value="reviewer">
            {t('language') === 'en' ? 'Reviewers' : 'المراجعين'}
          </TabsTrigger>
          <TabsTrigger value="admin">
            {t('language') === 'en' ? 'Administrators' : 'المديرين'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredUsers('all').length > 0 ? (
            filteredUsers('all').map((u) => (
              <Card key={u.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40`}
                          alt={u.name}
                        />
                        <AvatarFallback>{u.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{u.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {u.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {getRoleIcon(u.role)}
                        <span className="text-sm">{getRoleText(u.role)}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>
                            {t('language') === 'en' ? 'Actions' : 'الإجراءات'}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => router.push(`/admin/users/${u.id}`)}
                          >
                            <UserCog className="mr-2 h-4 w-4" />
                            {t('language') === 'en'
                              ? 'Edit User'
                              : 'تعديل المستخدم'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(u.id, 'user')}
                          >
                            <User className="mr-2 h-4 w-4" />
                            {t('language') === 'en'
                              ? 'Set as User'
                              : 'تعيين كمستخدم'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(u.id, 'reviewer')}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            {t('language') === 'en'
                              ? 'Set as Reviewer'
                              : 'تعيين كمراجع'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(u.id, 'admin')}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            {t('language') === 'en'
                              ? 'Set as Admin'
                              : 'تعيين كمدير'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <UserX className="mr-2 h-4 w-4" />
                            {t('language') === 'en'
                              ? 'Deactivate User'
                              : 'تعطيل المستخدم'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                {t('language') === 'en'
                  ? 'No users found'
                  : 'لم يتم العثور على مستخدمين'}
              </p>
            </div>
          )}
        </TabsContent>

        {['user', 'reviewer', 'admin'].map((role) => (
          <TabsContent key={role} value={role} className="space-y-4">
            {filteredUsers(role).length > 0 ? (
              filteredUsers(role).map((u) => (
                <Card key={u.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`/placeholder.svg?height=40&width=40`}
                            alt={u.name}
                          />
                          <AvatarFallback>{u.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{u.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {u.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          {getRoleIcon(u.role)}
                          <span className="text-sm">{getRoleText(u.role)}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                              {t('language') === 'en' ? 'Actions' : 'الإجراءات'}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/admin/users/${u.id}`)
                              }
                            >
                              <UserCog className="mr-2 h-4 w-4" />
                              {t('language') === 'en'
                                ? 'Edit User'
                                : 'تعديل المستخدم'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(u.id, 'user')}
                            >
                              <User className="mr-2 h-4 w-4" />
                              {t('language') === 'en'
                                ? 'Set as User'
                                : 'تعيين كمستخدم'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(u.id, 'reviewer')}
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              {t('language') === 'en'
                                ? 'Set as Reviewer'
                                : 'تعيين كمراجع'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(u.id, 'admin')}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              {t('language') === 'en'
                                ? 'Set as Admin'
                                : 'تعيين كمدير'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <UserX className="mr-2 h-4 w-4" />
                              {t('language') === 'en'
                                ? 'Deactivate User'
                                : 'تعطيل المستخدم'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  {t('language') === 'en'
                    ? 'No users found'
                    : 'لم يتم العثور على مستخدمين'}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('language') === 'en' ? 'Add New User' : 'إضافة مستخدم جديد'}
            </DialogTitle>
            <DialogDescription>
              {t('language') === 'en'
                ? 'Add a new user to the system. They will receive an email to set their password.'
                : 'إضافة مستخدم جديد إلى النظام. سيتلقون بريدًا إلكترونيًا لتعيين كلمة المرور الخاصة بهم.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">{t('name')}</label>
              <Input
                value={newUserData.name}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, name: e.target.value })
                }
                placeholder={
                  t('language') === 'en' ? 'Full Name' : 'الاسم الكامل'
                }
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">{t('email')}</label>
              <Input
                type="email"
                value={newUserData.email}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, email: e.target.value })
                }
                placeholder="email@example.com"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                {t('language') === 'en' ? 'User Role' : 'دور المستخدم'}
              </label>
              <Select
                value={selectedRole}
                onValueChange={(value) => {
                  setSelectedRole(value);
                  setNewUserData({ ...newUserData, role: value });
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      t('language') === 'en' ? 'Select role' : 'اختر الدور'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    {t('language') === 'en' ? 'User' : 'مستخدم'}
                  </SelectItem>
                  <SelectItem value="reviewer">
                    {t('language') === 'en' ? 'Reviewer' : 'مراجع'}
                  </SelectItem>
                  <SelectItem value="admin">
                    {t('language') === 'en' ? 'Administrator' : 'مدير'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleAddUser}>
              {t('language') === 'en' ? 'Add User' : 'إضافة مستخدم'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
