import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermissionsService } from '../../services/permissions.service';
import { Database, ref, set, onValue } from '@angular/fire/database';

interface ServerSettings {
    serverName: string;
    maxAgents: number;
    autoSaveInterval: number;
    dimensionSyncEnabled: boolean;
    anomalyDetectionLevel: 'low' | 'medium' | 'high';
    containmentProtocol: boolean;
    debugMode: boolean;
    maintenanceMode: boolean;
}

interface NotificationSettings {
    emailAlerts: boolean;
    anomalyAlerts: boolean;
    securityAlerts: boolean;
    performanceAlerts: boolean;
}

@Component({
    selector: 'app-settings',
    imports: [CommonModule, FormsModule],
    templateUrl: './settings.html',
    styleUrl: './settings.scss'
})
export class Settings implements OnInit {
    private database = inject(Database);
    permissionsService = inject(PermissionsService);

    adminLevel = this.permissionsService.adminLevel;

    // Server Settings
    serverSettings: ServerSettings = {
        serverName: 'DIMENSION-2 SERVER',
        maxAgents: 100,
        autoSaveInterval: 300,
        dimensionSyncEnabled: true,
        anomalyDetectionLevel: 'medium',
        containmentProtocol: true,
        debugMode: false,
        maintenanceMode: false
    };

    // Notification Settings
    notificationSettings: NotificationSettings = {
        emailAlerts: true,
        anomalyAlerts: true,
        securityAlerts: true,
        performanceAlerts: false
    };

    // UI State
    isSaving = false;
    saveSuccess = false;
    activeTab: 'server' | 'notifications' | 'security' | 'advanced' = 'server';

    ngOnInit(): void {
        this.loadSettings();
    }

    private loadSettings(): void {
        const settingsRef = ref(this.database, 'system/settings');
        onValue(settingsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                if (data.server) {
                    this.serverSettings = { ...this.serverSettings, ...data.server };
                }
                if (data.notifications) {
                    this.notificationSettings = { ...this.notificationSettings, ...data.notifications };
                }
            }
        });
    }

    async saveSettings(): Promise<void> {
        this.isSaving = true;
        this.saveSuccess = false;

        try {
            await set(ref(this.database, 'system/settings'), {
                server: this.serverSettings,
                notifications: this.notificationSettings,
                lastModified: new Date().toISOString()
            });

            this.saveSuccess = true;
            setTimeout(() => this.saveSuccess = false, 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            this.isSaving = false;
        }
    }

    switchTab(tab: 'server' | 'notifications' | 'security' | 'advanced'): void {
        this.activeTab = tab;
    }

    resetToDefaults(): void {
        this.serverSettings = {
            serverName: 'DIMENSION-2 SERVER',
            maxAgents: 100,
            autoSaveInterval: 300,
            dimensionSyncEnabled: true,
            anomalyDetectionLevel: 'medium',
            containmentProtocol: true,
            debugMode: false,
            maintenanceMode: false
        };

        this.notificationSettings = {
            emailAlerts: true,
            anomalyAlerts: true,
            securityAlerts: true,
            performanceAlerts: false
        };
    }
}
