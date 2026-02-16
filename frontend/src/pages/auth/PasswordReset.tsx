import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  KeyRound,
  Mail,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Step = 'email' | 'verify' | 'reset' | 'success';

export default function PasswordReset() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      toast.error("Veuillez entrer votre adresse email");
      return;
    }
    if (!email.includes('@')) {
      toast.error("Adresse email invalide");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    toast.success("Code de vérification envoyé à " + email);
    setStep('verify');
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Veuillez entrer le code à 6 chiffres");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    // Simulate code verification (in reality, this would be validated by backend)
    if (verificationCode === '123456') {
      setStep('reset');
    } else {
      toast.error("Code de vérification incorrect");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    // Check password strength
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      toast.error("Le mot de passe doit contenir majuscules, minuscules et chiffres");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    setStep('success');
    toast.success("Mot de passe réinitialisé avec succès");
  };

  const getPasswordStrength = (password: string): { label: string; color: string; percent: number } => {
    if (!password) return { label: '', color: 'bg-gray-200', percent: 0 };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { label: 'Faible', color: 'bg-red-500', percent: 33 };
    if (strength <= 4) return { label: 'Moyen', color: 'bg-yellow-500', percent: 66 };
    return { label: 'Fort', color: 'bg-green-500', percent: 100 };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <KeyRound className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Réinitialisation du Mot de Passe</h1>
          <p className="text-muted-foreground mt-2">Système de Gestion des Missions - RNP</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {/* Step: Email */}
            {step === 'email' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="mb-2">Entrez votre Email</CardTitle>
                  <CardDescription>
                    Nous vous enverrons un code de vérification pour réinitialiser votre mot de passe
                  </CardDescription>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Adresse Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@rnp.bi"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
                  />
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleSendCode}
                  disabled={isLoading}
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer le Code"}
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à la Connexion
                </Button>
              </div>
            )}

            {/* Step: Verify */}
            {step === 'verify' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="mb-2">Vérification</CardTitle>
                  <CardDescription>
                    Entrez le code à 6 chiffres envoyé à<br />
                    <span className="font-medium text-foreground">{email}</span>
                  </CardDescription>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Code de Vérification</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode()}
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Code de test: 123456
                  </p>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleVerifyCode}
                  disabled={isLoading}
                >
                  {isLoading ? "Vérification..." : "Vérifier"}
                </Button>

                <div className="flex justify-between text-sm">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setStep('email')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Retour
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleSendCode}
                  >
                    Renvoyer le code
                  </Button>
                </div>
              </div>
            )}

            {/* Step: Reset Password */}
            {step === 'reset' && (
              <div className="space-y-6">
                <div className="text-center">
                  <KeyRound className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="mb-2">Nouveau Mot de Passe</CardTitle>
                  <CardDescription>
                    Créez un nouveau mot de passe sécurisé
                  </CardDescription>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau Mot de Passe</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {newPassword && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Force du mot de passe:</span>
                          <span className={passwordStrength.percent === 100 ? 'text-green-600' : passwordStrength.percent === 66 ? 'text-yellow-600' : 'text-red-600'}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${passwordStrength.color} transition-all`}
                            style={{ width: `${passwordStrength.percent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le Mot de Passe</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-500">Les mots de passe ne correspondent pas</p>
                    )}
                    {confirmPassword && newPassword === confirmPassword && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Les mots de passe correspondent
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-muted p-3 rounded-lg text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Exigences du mot de passe:</p>
                  <ul className="space-y-1">
                    <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                      • Au moins 8 caractères
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                      • Une lettre majuscule
                    </li>
                    <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>
                      • Une lettre minuscule
                    </li>
                    <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                      • Un chiffre
                    </li>
                  </ul>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleResetPassword}
                  disabled={isLoading}
                >
                  {isLoading ? "Réinitialisation..." : "Réinitialiser le Mot de Passe"}
                </Button>
              </div>
            )}

            {/* Step: Success */}
            {step === 'success' && (
              <div className="space-y-6 text-center">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <CardTitle className="mb-2 text-green-600">Mot de Passe Réinitialisé!</CardTitle>
                  <CardDescription>
                    Votre mot de passe a été changé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                  </CardDescription>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => navigate('/login')}
                >
                  Aller à la Connexion
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          © 2025 Régie Nationale des Postes - Burundi
        </p>
      </div>
    </div>
  );
}
