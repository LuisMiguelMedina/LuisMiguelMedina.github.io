import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersService } from '../../services/players.service';

@Component({
    selector: 'app-players',
    imports: [CommonModule],
    templateUrl: './players.html',
    styleUrl: './players.scss'
})
export class Players {
    private playersService = inject(PlayersService);

    // Current selected dimension
    selectedDimension = signal<1 | 2>(1);

    // Service data
    loading = this.playersService.loading;
    allPlayers = this.playersService.players;
    dimensions = this.playersService.dimensions;

    // Computed: players for current dimension
    currentPlayers = computed(() => {
        return this.playersService.getPlayersByDimension(this.selectedDimension());
    });

    // Computed: current dimension info
    currentDimension = computed(() => {
        return this.playersService.getDimension(this.selectedDimension());
    });

    // Computed: player counts
    totalPlayers = computed(() => this.currentPlayers().length);
    activePlayers = computed(() => this.currentPlayers().filter(p => p.status === 1).length);
    inactivePlayers = computed(() => this.currentPlayers().filter(p => p.status === 2).length);

    // Dimension 1 stats
    dimension1Players = computed(() => this.playersService.getPlayersByDimension(1).length);
    dimension1Active = computed(() => this.playersService.getActivePlayerCount(1));

    // Dimension 2 stats
    dimension2Players = computed(() => this.playersService.getPlayersByDimension(2).length);
    dimension2Active = computed(() => this.playersService.getActivePlayerCount(2));

    selectDimension(dim: 1 | 2): void {
        this.selectedDimension.set(dim);
    }

    getStatusText(): string {
        const dim = this.currentDimension();
        if (!dim) return 'UNKNOWN';

        switch (dim.status) {
            case 'online': return 'ONLINE';
            case 'offline': return 'OFFLINE';
            case 'maintenance': return 'MAINTENANCE';
            default: return 'UNKNOWN';
        }
    }

    getStatusClass(): string {
        const dim = this.currentDimension();
        if (!dim) return '';

        switch (dim.status) {
            case 'online': return 'status-online';
            case 'offline': return 'status-offline';
            case 'maintenance': return 'status-maintenance';
            default: return '';
        }
    }
}
