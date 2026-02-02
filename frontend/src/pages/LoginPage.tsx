import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../app/auth";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const schema = z.object({
    email: z.string().email("Geçerli email gir"),
    password: z.string().min(4, "En az 4 karakter"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const nav = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { email: "student@gqa.edu", password: "1234" },
    });

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 grid lg:grid-cols-2">
            <div className="flex items-center justify-center p-6">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="text-lg font-semibold">GQA Portal</div>
                        <div className="text-sm text-neutral-400">Öğrenci Girişi</div>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit(async (data) => {
                                login(data.email, "Ozan (Demo)");
                                nav("/");
                            })}
                            className="space-y-4"
                        >
                            <div>
                                <div className="text-sm mb-1 text-neutral-300">Email</div>
                                <Input {...register("email")} placeholder="student@gqa.edu" />
                                {errors.email && <div className="text-xs text-red-300 mt-1">{errors.email.message}</div>}
                            </div>

                            <div>
                                <div className="text-sm mb-1 text-neutral-300">Şifre</div>
                                <Input {...register("password")} type="password" placeholder="••••" />
                                {errors.password && <div className="text-xs text-red-300 mt-1">{errors.password.message}</div>}
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                Giriş Yap
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full"
                                onClick={() => {
                                    login("student@gqa.edu", "Demo User");
                                    nav("/");
                                }}
                            >
                                Demo ile devam et
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className="hidden lg:flex items-center justify-center p-10 border-l border-neutral-900 bg-gradient-to-br from-blue-500/10 via-neutral-950 to-amber-300/10">
                <div className="max-w-lg">
                    <div className="text-3xl font-semibold leading-tight">
                        Klinik Çalışma Yönetimi <span className="text-neutral-400">•</span> Form & Visit Takibi
                    </div>
                    <div className="mt-4 text-neutral-300">
                        Studies, visit templates, form templates, subjects ve scheduled visits akışını tek panelden yönet.
                    </div>
                    <div className="mt-6 text-sm text-neutral-400">
                        Bu ekran “öğrenci otomasyonu” hissi için tasarlandı — assignment akışını modern UI ile gösterir.
                    </div>
                </div>
            </div>
        </div>
    );
}
