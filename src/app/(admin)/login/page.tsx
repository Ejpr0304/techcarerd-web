"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Mail, ArrowLeft, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Introduce un correo electrónico válido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError("");

    try {
      // Simular latencia de autenticación de 1 segundo
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // En desarrollo simulamos un login administrativo
      if (data.email === "admin@techcare.com.do" && data.password === "admin123") {
        router.push("/dashboard");
      } else {
        setError("Credenciales de demostración incorrectas. Utiliza admin@techcare.com.do y admin123");
      }
    } catch (err) {
      setError("Error de autenticación. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 font-sans text-neutral-200">
      {/* Back button */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al sitio
      </Link>

      <Card className="w-full max-w-md bg-neutral-900/40 border-neutral-900 shadow-2xl p-6 backdrop-blur-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-white">Portal Administrativo</CardTitle>
          <CardDescription className="text-neutral-500 mt-1">
            Ingresa tus credenciales para acceder a la gestión de TechCareRD.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-neutral-300">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@techcare.com.do"
                  className="h-11 bg-neutral-950 border-neutral-800 text-white pl-10 focus:border-blue-500 focus:ring-blue-500/20"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-semibold text-neutral-300">
                  Contraseña
                </Label>
                <span className="text-xs text-blue-500 hover:text-blue-400 cursor-pointer">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 bg-neutral-950 border-neutral-800 text-white pl-10 focus:border-blue-500 focus:ring-blue-500/20"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-950/80 border border-red-500/30 text-red-400 rounded-lg flex items-start gap-2 text-xs">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-4 flex flex-col gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-6 rounded-lg transition-all duration-300 cursor-pointer shadow-md"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
            
            <div className="text-center text-xs text-neutral-500 mt-2">
              <p>Credenciales de demo:</p>
              <p className="font-mono text-neutral-400 mt-0.5">admin@techcare.com.do / admin123</p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
