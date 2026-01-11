import { Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class OwnershipHelperService {
  /**
   * Verify that a resource belongs to a user
   * @param resource Resource with userId property
   * @param userId User ID to verify against
   * @param resourceName Name of the resource for error message
   * @throws ForbiddenException if resource doesn't belong to user
   */
  verifyResourceOwnership(
    resource: { userId: string },
    userId: string,
    resourceName: string = 'Resource',
  ): void {
    if (resource.userId !== userId) {
      throw new ForbiddenException(
        `You can only access your own ${resourceName.toLowerCase()}`,
      );
    }
  }
}
