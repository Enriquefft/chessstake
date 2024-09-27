"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { profileInsertionSchema } from "@/db/schema";
import type { z } from "zod";
import { setUserProfile } from "@/lib/auth";

const profileCompletionSchema = profileInsertionSchema.omit({
  userId: true,
});
type ProfileCompletion = z.infer<typeof profileCompletionSchema>;

/**
 *
 * @param root0
 * @param root0.userId
 */
export default function ProfilePage({ userId }: { userId: string }) {
  const form = useForm<ProfileCompletion>({
    resolver: zodResolver(profileCompletionSchema),
  });
  const onSubmit = async (data: ProfileCompletion) => {
    await setUserProfile(userId, data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  <SelectItem value="principiante">Principiante</SelectItem>
                  <SelectItem value="intermedio">Intermedio</SelectItem>
                  <SelectItem value="avanzado">Avanzado</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                How would you describe your chess level?
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="dni"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>DNI</FormLabel>
              <FormControl>
                <Input placeholder="dni" {...field} />
              </FormControl>
              <FormDescription>This is your DNI</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription>This is your username</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
