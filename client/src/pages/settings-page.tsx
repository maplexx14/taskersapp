import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { UserNav } from "@/components/user-nav";
import { ThemeSwitch } from "@/components/theme-switch";
import { useLocaleStore, useTranslation } from "@/lib/i18n";
import { useSoundSettings } from "@/hooks/use-sound-settings";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocaleStore();
  const { enabled, volume, setEnabled, setVolume } = useSoundSettings();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('backToTasks')}
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSwitch />
            <UserNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle>{t('settings')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('language')}</label>
                <Select value={locale} onValueChange={(value: 'ru' | 'en') => setLocale(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('theme')}</label>
                <div className="flex items-center space-x-2">
                  <ThemeSwitch />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">{t('sounds')}</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('enableSounds')}
                  </span>
                  <Switch
                    checked={enabled}
                    onCheckedChange={setEnabled}
                  />
                </div>
                {enabled && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        {t('volume')}
                      </span>
                      <span className="text-sm">
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[volume]}
                      onValueChange={([value]) => setVolume(value)}
                      max={1}
                      step={0.1}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}