import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Alert } from '../entities/alert.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
  ) {}

  async setAlert(
    email: string,
    threshold: number,
    chain: string,
  ): Promise<Alert> {
    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      user = this.userRepository.create({ name: email, email });
      await this.userRepository.save(user);
    }
    const alert = this.alertRepository.create({
      threshold,
      chain,
      email,
      user,
    });
    return await this.alertRepository.save(alert);
  }
  async fetchAllAlerts(): Promise<Alert[]> {
    return await this.alertRepository.find({ relations: ['user'] });
  }
}
