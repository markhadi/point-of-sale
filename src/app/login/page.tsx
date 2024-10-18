'use client';

import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Coffee } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    if (session?.user) {
      const roleRedirect = session.user.role === 'ADMIN' ? '/admin/dashboard' : '/cashier/dashboard';
      router.push(roleRedirect);
    }
  }, [session, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(''); // Reset error sebelum proses login

    const result = await signIn('credentials', {
      redirect: false,
      username: values.username,
      password: values.password,
    });

    if (result && !result.error) {
      router.push(session?.user.role === 'ADMIN' ? '/admin/dashboard' : '/cashier/dashboard');
    } else {
      setError('Incorrect username or password.');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-neutral-50">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm bg-indigo-50 rounded-xl p-10 shadow-md"
        >
          {/* Icon dan Heading */}
          <div className="text-center">
            <Coffee className="mx-auto w-12 h-12 text-indigo-600" />
            <h2 className="text-2xl text-indigo-600 font-bold mb-6">Login</h2>
          </div>

          {/* Input Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="text-neutral-900 text-[16px]">Username</FormLabel>
                <FormControl>
                  <Input
                    className="px-4 py-2 text-[16px] rounded-md bg-neutral-50"
                    placeholder="Enter your username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Input Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="text-neutral-900 text-[16px]">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="px-4 py-2 text-[16px] rounded-md bg-neutral-50"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error Message */}
          {error && <p className="text-red-500 text-center text-xs mb-2">{error}</p>}

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 w-full text-[16px] font-bold text-white rounded-md"
          >
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
