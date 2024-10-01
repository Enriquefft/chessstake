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
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    defaultValues: {
      dni: "",
      username: "",
      level: undefined,
      phone: "",
    },
  });
  const router = useRouter();
  const [generalError, setGeneralError] = useState<string | null>(null); // State for server errors
  const onSubmit = async (data: ProfileCompletion) => {
    try {
      setGeneralError(null); // Reset general error before submission
      await setUserProfile(userId, data);
      router.push("/activation");
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        setGeneralError(
          "An unexpected error occurred. Please try again later.",
        );
        return;
      }
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes("profile_username_unique")) {
        form.setError("username", {
          type: "manual",
          message: "This username is already taken. Please choose another one.",
        });
      } else if (errorMessage.includes("profile_phone_unique")) {
        form.setError("phone", {
          type: "manual",
          message: "This phone is already taken. Please choose another one.",
        });
      } else if (errorMessage.includes("profile_pkey")) {
        setGeneralError("A profile for this user already exists.");
      } else {
        setGeneralError(
          "An unexpected error occurred. Please try again later.",
        );
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {generalError !== null && (
          <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
            {generalError}
          </div>
        )}
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
        <FormField
          name="phone"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="phone" {...field} />
              </FormControl>
              <FormDescription>This is your phone number</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
